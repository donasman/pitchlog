package com.pitchlog.domain.service;

import com.pitchlog.api.dto.CountryResponse;
import com.pitchlog.api.dto.SquadResponse;
import com.pitchlog.domain.entity.Country;
import com.pitchlog.domain.entity.SquadEntry;
import com.pitchlog.domain.exception.ResourceNotFoundException;
import com.pitchlog.domain.repository.CountryRepository;
import com.pitchlog.domain.repository.SquadEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CountryService {

    private final CountryRepository countryRepository;
    private final SquadEntryRepository squadEntryRepository;

    public List<CountryResponse> findAll() {
        return countryRepository.findAll().stream()
                .map(CountryResponse::from)
                .toList();
    }

    public SquadResponse findSquadByCountryCode(String code) {
        Country country = countryRepository.findByCode(code)
                .orElseThrow(() -> ResourceNotFoundException.country(code));

        List<SquadEntry> entries = squadEntryRepository.findActiveByCountryCode(code);

        return new SquadResponse(
                CountryResponse.from(country),
                entries.stream().map(SquadResponse.SquadPlayerItem::from).toList()
        );
    }
}
