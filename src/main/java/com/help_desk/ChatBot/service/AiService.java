package com.help_desk.ChatBot.service;


import com.help_desk.ChatBot.tools.EmailTool;
import com.help_desk.ChatBot.tools.TicketDBTool;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class AiService {
    private final ChatClient chatClient;
    private final TicketDBTool ticketDBTool;
    private final EmailTool emailTool;

    @Value("classpath:/helpdesk-system.st")
    private Resource system;

    public String getResponseFromAssistant(String query,String conversationId) {
        return chatClient
                .prompt()
                .system(system)
                .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID,conversationId))
                .tools(ticketDBTool,emailTool)
                .user(query )
                .call()
                .content();
    }

    public Flux<String> streamResponse(String query , String conversationId) {
        return chatClient
                .prompt()
                .system(system)
                .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID,conversationId))
                .tools(ticketDBTool,emailTool)
                .user(query )
                .stream()
                .content();
    }
}
