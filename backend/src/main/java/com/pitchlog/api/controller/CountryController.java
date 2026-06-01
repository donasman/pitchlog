package com.pitchlog.api.controller;

import com.pitchlog.api.dto.CountryResponse;
import com.pitchlog.api.dto.SquadResponse;
import com.pitchlog.domain.service.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/countries")
@RequiredArgsConstructor
public class CountryController {

    private final CountryService countryService;

    @GetMapping
    public ResponseEntity<List<CountryResponse>> getCountries() {
        return ResponseEntity.ok(countryService.findAll());
    }

    @GetMapping("/{code}/squad")
    public ResponseEntity<SquadResponse> getSquad(@PathVariable String code) {
        return ResponseEntity.ok(countryService.findSquadByCountryCode(code.toUpperCase()));
    }
}
