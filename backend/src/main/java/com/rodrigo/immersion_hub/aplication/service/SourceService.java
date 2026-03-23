package com.rodrigo.immersion_hub.aplication.service;

import com.rodrigo.immersion_hub.api.dto.request.SourceRequestDTO;
import com.rodrigo.immersion_hub.api.dto.response.SourceResponseDTO;
import com.rodrigo.immersion_hub.domain.enums.Language;
import com.rodrigo.immersion_hub.domain.exception.NotFoundException;
import com.rodrigo.immersion_hub.domain.model.Source;
import com.rodrigo.immersion_hub.domain.model.User;
import com.rodrigo.immersion_hub.domain.model.UserFavoriteSource;
import com.rodrigo.immersion_hub.domain.model.UserFavoriteSourceId;
import com.rodrigo.immersion_hub.domain.repository.SourceRepository;
import com.rodrigo.immersion_hub.domain.repository.UserFavoriteSourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
@Transactional
public class SourceService {

    private final SourceRepository sourceRepository;
    private final UserFavoriteSourceRepository userFavoriteSourceRepository;

    public SourceService(SourceRepository sourceRepository, UserFavoriteSourceRepository userFavoriteSourceRepository) {
        this.sourceRepository = sourceRepository;
        this.userFavoriteSourceRepository = userFavoriteSourceRepository;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }

    private Set<UUID> getFavoriteSourceIds(UUID userId) {
        return userFavoriteSourceRepository.findSourceIdsByUserId(userId);
    }

    private SourceResponseDTO toResponseDTO(Source source, Set<UUID> favoriteSourceIds) {
        return SourceResponseDTO.fromEntity(source, favoriteSourceIds.contains(source.getId()));
    }


    public List<SourceResponseDTO>findAll() {
        User currentUser = getCurrentUser();
        Set<UUID> favoriteSourceIds = getFavoriteSourceIds(currentUser.getId());
        return sourceRepository.findAll()
                .stream()
                .map(source -> toResponseDTO(source, favoriteSourceIds))
                .toList();
    }
    public SourceResponseDTO create(SourceRequestDTO requestDTO){
        Source source = new Source();
        source.setId(UUID.randomUUID());
        source.setName(requestDTO.name());
        source.setUrl(requestDTO.url());
        source.setDescription(requestDTO.description());
        source.setCategory(requestDTO.category());
        source.setLanguage(requestDTO.language());
        
        Source savedSource = sourceRepository.save(source);
        return SourceResponseDTO.fromEntity(savedSource, false);
    }


    public void deleteById(UUID id){
        sourceRepository.deleteById(id);
    }

    public List<SourceResponseDTO> findByLanguage(Language language) {
        User currentUser = getCurrentUser();
        List<Source> sources = sourceRepository.findByLanguage(language);
        Set<UUID> favoriteSourceIds = getFavoriteSourceIds(currentUser.getId());

        
        return sources.stream()
                .map(source -> toResponseDTO(source, favoriteSourceIds))
                .toList();
    }

    public void favoriteSource(UUID sourceId) {
        User currentUser = getCurrentUser();
        Source source = sourceRepository.findById(sourceId)
                .orElseThrow(() -> new NotFoundException("Source not found with id: " + sourceId));

        boolean alreadyFavorited = userFavoriteSourceRepository.existsByUser_IdAndSource_Id(currentUser.getId(), sourceId);
        if (alreadyFavorited) {
            return;
        }

        UserFavoriteSource favorite = new UserFavoriteSource();
        favorite.setId(new UserFavoriteSourceId(currentUser.getId(), sourceId));
        favorite.setUser(currentUser);
        favorite.setSource(source);
        userFavoriteSourceRepository.save(favorite);
    }

    public void unfavoriteSource(UUID sourceId) {
        User currentUser = getCurrentUser();
        userFavoriteSourceRepository.deleteByUser_IdAndSource_Id(currentUser.getId(), sourceId);
    }

}
