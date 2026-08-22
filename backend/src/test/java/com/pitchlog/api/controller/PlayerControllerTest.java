package com.pitchlog.api.controller;

import com.pitchlog.api.dto.PlayerDetailResponse;
import com.pitchlog.api.dto.StatsRankingResponse;
import com.pitchlog.config.JwtUtil;
import com.pitchlog.domain.exception.ResourceNotFoundException;
import com.pitchlog.domain.service.PlayerService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = PlayerController.class)
class PlayerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PlayerService playerService;

    /**
     * AdminAuthFilter 는 @Component 이자 Filter 라서 @WebMvcTest 슬라이스에 포함된다.
     * 그 의존성인 JwtUtil 은 슬라이스에 없으므로 목으로 채워야 컨텍스트가 뜬다.
     * (/api/players/** 는 보호 대상 경로가 아니라 필터는 그냥 통과한다)
     */
    @MockBean
    private JwtUtil jwtUtil;

    private static StatsRankingResponse rank(long id, String name, String nationality,
                                             int goals, int assists, int apps) {
        return new StatsRankingResponse(id, name, null, nationality, goals, assists, apps, 0, 0);
    }

    @Test
    @DisplayName("GET /api/players/{id} — 선수 상세 정보 반환")
    void getPlayer_returnsPlayerDetail() throws Exception {
        PlayerDetailResponse response = new PlayerDetailResponse(
                1L, "Lionel Messi", "Lionel", "Messi",
                "Argentina", "1987-06-24", "169 cm", "67 kg",
                "https://photo.url/messi.png", List.of()
        );
        given(playerService.findById(1L)).willReturn(response);

        mockMvc.perform(get("/api/players/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Lionel Messi"))
                .andExpect(jsonPath("$.nationality").value("Argentina"));
    }

    @Test
    @DisplayName("GET /api/players/{id} — 존재하지 않는 선수면 404")
    void getPlayer_notFound() throws Exception {
        given(playerService.findById(999L))
                .willThrow(ResourceNotFoundException.player(999L));

        mockMvc.perform(get("/api/players/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/players/top-scorers — 기본 limit=20, source=season")
    void getTopScorers_returnsRanking() throws Exception {
        given(playerService.getTopScorers(20)).willReturn(List.of(
                rank(1L, "Player A", "Brazil", 15, 5, 30),
                rank(2L, "Player B", "France", 12, 8, 28)
        ));

        mockMvc.perform(get("/api/players/top-scorers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].goals").value(15))
                .andExpect(jsonPath("$[1].goals").value(12));
    }

    @Test
    @DisplayName("GET /api/players/top-scorers?source=worldcup — 월드컵 집계로 분기")
    void getTopScorers_worldCupSource() throws Exception {
        given(playerService.getTopScorersWorldCup(20)).willReturn(List.of(
                rank(3L, "WC Player", "Spain", 7, 2, 6)
        ));

        mockMvc.perform(get("/api/players/top-scorers").param("source", "worldcup"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].playerName").value("WC Player"));
    }

    @Test
    @DisplayName("GET /api/players/top-assists — limit 파라미터 적용")
    void getTopAssists_withCustomLimit() throws Exception {
        given(playerService.getTopAssists(5)).willReturn(List.of(
                rank(2L, "Player B", "France", 12, 8, 28)
        ));

        mockMvc.perform(get("/api/players/top-assists").param("limit", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].assists").value(8));
    }
}
