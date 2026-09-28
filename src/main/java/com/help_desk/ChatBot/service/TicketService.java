package com.help_desk.ChatBot.service;

import com.help_desk.ChatBot.entity.Ticket;
import com.help_desk.ChatBot.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;

    public Ticket createTicket(Ticket ticketId) {
        
        return ticketRepository.save(ticketId);
    }
    public Ticket updateTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public Ticket getTicket(Long ticketId) {
        return ticketRepository.findByTicketId(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }
    public Ticket getTicketByEmailId(String username) {
        return ticketRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }
}
