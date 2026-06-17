package com.pitchlog.domain.service;

import com.pitchlog.api.dto.PredictionResponse;
import com.pitchlog.domain.repository.FixturePredictionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PredictionService {

    private final FixturePredictionRepository predictionRepository;

    public Optional<PredictionResponse> getByFixtureId(Integer fixtureId) {
        return predictionRepository.findByFixtureId(fixtureId)
                .map(PredictionResponse::from);
    }
}
