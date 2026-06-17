package com.pitchlog.domain.service;

import com.pitchlog.api.dto.OddsResponse;
import com.pitchlog.domain.repository.FixtureOddsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OddsService {

    private final FixtureOddsRepository oddsRepository;

    public Optional<OddsResponse> getByFixtureId(Integer fixtureId) {
        return oddsRepository.findByFixtureId(fixtureId)
                .map(OddsResponse::from);
    }
}
