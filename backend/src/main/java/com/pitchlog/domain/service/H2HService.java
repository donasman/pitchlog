package com.pitchlog.domain.service;

import com.pitchlog.api.dto.H2HRecordResponse;
import com.pitchlog.domain.entity.H2HRecord;
import com.pitchlog.domain.repository.H2HRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class H2HService {

    private final H2HRecordRepository h2hRecordRepository;

    /** GET /api/h2h/{team1}-{team2} */
    public List<H2HRecordResponse> getH2H(Integer team1, Integer team2) {
        String pair = H2HRecord.buildPair(team1, team2);
        return h2hRecordRepository.findByTeamPairOrderByMatchDateDesc(pair)
                .stream()
                .map(H2HRecordResponse::from)
                .toList();
    }
}
