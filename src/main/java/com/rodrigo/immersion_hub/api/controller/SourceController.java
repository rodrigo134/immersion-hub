package com.rodrigo.immersion_hub.api.controller;


import com.rodrigo.immersion_hub.aplication.service.SourceService;
import com.rodrigo.immersion_hub.domain.model.Source;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/sources")
public class SourceController {

    public final SourceService sourceService;

    public SourceController(SourceService sourceService) {
        this.sourceService = sourceService;
    }

    @GetMapping
    public List<Source> getAll() {
        return sourceService.findAll();
    }
    @PostMapping
    public Source create(@RequestBody Source source){
        return sourceService.create(source);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        sourceService.deleteById(id);
    }




}