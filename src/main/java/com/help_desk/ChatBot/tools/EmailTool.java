package com.help_desk.ChatBot.tools;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

@Component
public class EmailTool {

    @Tool(description = "This tool helps to send email to support team regarding new ticket.")
    public void sendEmailToSupportTeam(@ToolParam(description = "Email id associated with ticket for contact information.") String email, @ToolParam(description = "Short description of ticket summary.") String message){
        // sending email to support team
        System.out.println("going to send email to support team");
        System.out.println("email id : "+email);
        System.out.println("message : "+message);


    }

}
