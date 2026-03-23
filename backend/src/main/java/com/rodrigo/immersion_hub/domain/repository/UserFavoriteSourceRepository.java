package com.rodrigo.immersion_hub.domain.repository;

import com.rodrigo.immersion_hub.domain.model.UserFavoriteSource;
import com.rodrigo.immersion_hub.domain.model.UserFavoriteSourceId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.UUID;

@Repository
public interface UserFavoriteSourceRepository extends JpaRepository<UserFavoriteSource, UserFavoriteSourceId> {

    boolean existsByUser_IdAndSource_Id(UUID userId, UUID sourceId);

    @Modifying
    void deleteByUser_IdAndSource_Id(UUID userId, UUID sourceId);

    @Query("select favorite.source.id from UserFavoriteSource favorite where favorite.user.id = :userId")
    Set<UUID> findSourceIdsByUserId(@Param("userId") UUID userId);
}
