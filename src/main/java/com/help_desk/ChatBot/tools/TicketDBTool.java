package com.help_desk.ChatBot.tools;

import com.help_desk.ChatBot.entity.Ticket;
import com.help_desk.ChatBot.service.TicketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TicketDBTool {

    private final TicketService ticketService;

    @Tool(description = "This tool helps to create new ticket in database")
    public Ticket createTicket(@ToolParam(description = "Ticket fields required to create new ticket") Ticket ticket) {
        try {
            System.out.println("going to create ticket");
            System.out.println(ticket);
            return ticketService.createTicket(ticket);
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }
    //get ticket by using username
    @Tool(description = "this tool helps to get ticket by username")
    public Ticket getTicketByEmailId(@ToolParam(description = "email id whose ticket is required ") String username ) {
        return ticketService.getTicketByEmailId(username );
    }

    @Tool(description = "This helps to update ticket")
    public Ticket updateTicket(@ToolParam(description = "new ticket fields required to update with ticket id.") Ticket ticket){
        return ticketService.updateTicket(ticket);
    }

    //get current date time
    @Tool(description = "This tool helps to get current system time.")
    public String getCurrentDateTime(){
        return String.valueOf(System.currentTimeMillis());
    }

}
