package com.pitchlog.domain.service;

import com.pitchlog.api.dto.CoachResponse;
import com.pitchlog.domain.repository.CoachRepository;
import com.pitchlog.domain.repository.CountryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CoachService {

    private final CoachRepository coachRepository;
    private final CountryRepository countryRepository;

    /** 전체 감독 목록 (팀명 정렬) */
    public List<CoachResponse> getAll() {
        return coachRepository.findAllByOrderByTeamNameAsc()
                .stream()
                .map(CoachResponse::from)
                .toList();
    }

    /** 국가 코드로 해당 대표팀 감독 조회 */
    public Optional<CoachResponse> getByCountryCode(String countryCode) {
        return countryRepository.findByCodeIgnoreCase(countryCode)
                .flatMap(country ->
                        country.getTeamApiId() != null
                                ? coachRepository.findByTeamApiId(country.getTeamApiId())
                                : Optional.empty()
                )
                .map(CoachResponse::from);
    }

    /** teamApiId로 직접 조회 */
    public Optional<CoachResponse> getByTeamApiId(Integer teamApiId) {
        return coachRepository.findByTeamApiId(teamApiId)
                .map(CoachResponse::from);
    }
}
