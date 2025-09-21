package com.nexsplit.dto.expense;

import com.nexsplit.model.Expense;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Request DTO for creating a new expense.
 * Contains all necessary information to create an expense with splits.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateExpenseRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Amount must have at most 8 integer digits and 2 decimal places")
    private BigDecimal amount;

    @Size(max = 10, message = "Currency must not exceed 10 characters")
    @Builder.Default
    private String currency = "USD"; // TODO: Replace with configuration property

    @NotBlank(message = "Category ID is required")
    private String categoryId;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotBlank(message = "Nex ID is required")
    private String nexId;

    @NotBlank(message = "Payer ID is required")
    private String payerId;

    @NotNull(message = "Split type is required")
    private Expense.SplitType splitType;

    @Builder.Default
    private Boolean isInitialPayerHas = false;

    @NotNull(message = "Expense date is required")
    private LocalDate expenseDate;

    /**
     * List of splits for this expense.
     * Required for PERCENTAGE and AMOUNT split types.
     * Optional for EQUALLY split type (will be calculated automatically).
     */
    private List<CreateSplitRequest> splits;

    /**
     * Request DTO for creating a split within an expense.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateSplitRequest {

        @NotBlank(message = "User ID is required")
        private String userId;

        /**
         * Percentage for PERCENTAGE split type.
         * Must be between 0 and 100.
         */
        @DecimalMin(value = "0.00", message = "Percentage must be non-negative")
        @DecimalMax(value = "100.00", message = "Percentage must not exceed 100")
        @Digits(integer = 3, fraction = 2, message = "Percentage must have at most 3 integer digits and 2 decimal places")
        private BigDecimal percentage;

        /**
         * Amount for AMOUNT split type.
         * Must be positive.
         */
        @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        @Digits(integer = 8, fraction = 2, message = "Amount must have at most 8 integer digits and 2 decimal places")
        private BigDecimal amount;

    }
}
