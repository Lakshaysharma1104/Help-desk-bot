package com.help_desk.ChatBot.entity;


import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "help_desk_ticket")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id")
    private Long ticketId;
    @Lob
    private String summary;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Column(unique=true)
    private String email;
    private LocalDateTime createdOn;
    private LocalDateTime updatedOn;

    private Status status;
    @PrePersist
    void preSave(){
        if(this.createdOn == null){
            this.createdOn = LocalDateTime.now();
        }
        this.updatedOn = LocalDateTime.now();
    }
    @PreUpdate
    void preUpdate(){
        this.updatedOn = LocalDateTime.now();
    }



}
