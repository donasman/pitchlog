package com.pitchlog.api.controller;

import com.pitchlog.api.dto.PlayerDetailResponse;
import com.pitchlog.api.dto.StatsRankingResponse;
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
    @DisplayName("GET /api/players/{id} — 존재하지 않는 선수 404")
    void getPlayer_notFound() throws Exception {
        given(playerService.findById(999L))
                .willThrow(new IllegalArgumentException("선수를 찾을 수 없습니다: 999"));

        mockMvc.perform(get("/api/players/999"))
                .andExpect(status().isNotFound()); // GlobalExceptionHandler 에서 404 처리
    }

    @Test
    @DisplayName("GET /api/players/top-scorers — 득점 순위 반환 (기본 limit=20)")
    void getTopScorers_returnsRanking() throws Exception {
        List<StatsRankingResponse> ranking = List.of(
                new StatsRankingResponse(1L, "Player A", null, "Brazil", 15, 5, 30),
                new StatsRankingResponse(2L, "Player B", null, "France", 12, 8, 28)
        );
        given(playerService.getTopScorers(20)).willReturn(ranking);

        mockMvc.perform(get("/api/players/top-scorers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].goals").value(15))
                .andExpect(jsonPath("$[1].goals").value(12));
    }

    @Test
    @DisplayName("GET /api/players/top-assists — 도움 순위 반환 (limit 파라미터 적용)")
    void getTopAssists_withCustomLimit() throws Exception {
        List<StatsRankingResponse> ranking = List.of(
                new StatsRankingResponse(2L, "Player B", null, "France", 12, 8, 28)
        );
        given(playerService.getTopAssists(5)).willReturn(ranking);

        mockMvc.perform(get("/api/players/top-assists").param("limit", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].assists").value(8));
    }
}
