package com.pitchlog.domain.service;

import com.pitchlog.api.dto.InjuryResponse;
import com.pitchlog.domain.repository.PlayerInjuryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InjuryService {

    private final PlayerInjuryRepository playerInjuryRepository;

    /** 현재 시각 이후 경기의 전체 부상/출전정지 목록 */
    public List<InjuryResponse> getUpcoming() {
        return playerInjuryRepository.findUpcoming(LocalDateTime.now())
                .stream()
                .map(InjuryResponse::from)
                .toList();
    }

    /** 특정 팀 부상/출전정지 목록 */
    public List<InjuryResponse> getUpcomingByTeam(Integer teamApiId) {
        return playerInjuryRepository.findUpcomingByTeam(teamApiId, LocalDateTime.now())
                .stream()
                .map(InjuryResponse::from)
                .toList();
    }

    /** 선수 상세 페이지용: 특정 선수의 현재 부상 여부 */
    public boolean isInjured(Integer playerApiId) {
        return playerInjuryRepository.existsUpcomingByPlayerApiId(playerApiId, LocalDateTime.now());
    }

    /** 선수 상세 페이지용: 특정 선수의 현재 부상 목록 */
    public List<InjuryResponse> getByPlayerApiId(Integer playerApiId) {
        return playerInjuryRepository.findUpcomingByPlayerApiId(playerApiId, LocalDateTime.now())
                .stream()
                .map(InjuryResponse::from)
                .toList();
    }
}
