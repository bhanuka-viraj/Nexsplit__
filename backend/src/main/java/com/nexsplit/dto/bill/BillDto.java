package com.nexsplit.dto.bill;

import com.nexsplit.model.Bill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Response DTO for bill data.
 * Contains complete bill information.
 * 
 * @author NexSplit Team
 * @version 1.0
 * @since 1.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillDto {

    private String id;
    private String nexId;
    private String nexName;
    private String createdBy;
    private String creatorName;
    private String title;
    private BigDecimal amount;
    private String currency;
    private LocalDateTime dueDate;
    private Bill.Frequency frequency;
    private LocalDateTime nextDueDate;
    private Boolean isRecurring;
    private Boolean isPaid;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private Integer participantCount;
    private Integer paidParticipantCount;
    private BigDecimal totalPaidAmount;
    private Bill.BillType billType;
}
