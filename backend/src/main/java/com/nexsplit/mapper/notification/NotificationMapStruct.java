package com.nexsplit.mapper.notification;

import com.nexsplit.dto.notification.NotificationDto;
import com.nexsplit.dto.notification.NotificationSummaryDto;
import com.nexsplit.dto.notification.CreateNotificationRequest;
import com.nexsplit.dto.notification.UpdateNotificationRequest;
import com.nexsplit.model.Notification;
import org.mapstruct.*;

import java.util.List;

/**
 * MapStruct mapper for converting between Notification entities and DTOs.
 * 
 * This mapper provides type-safe, compile-time generated mapping code for
 * converting between Notification entities and their corresponding DTOs.
 * 
 * @author NexSplit Team
 * @version 1.0
 * @since 1.0
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface NotificationMapStruct {

    /**
     * Convert CreateNotificationRequest to Notification entity.
     * 
     * @param request The create request DTO
     * @return Notification entity
     */
    Notification toEntity(CreateNotificationRequest request);

    /**
     * Convert Notification entity to NotificationDto.
     * 
     * @param notification The notification entity
     * @return NotificationDto
     */
    @Mapping(target = "userName", source = "user.firstName")
    @Mapping(target = "userEmail", source = "user.email")
    @Mapping(target = "nexName", source = "nex.name")
    NotificationDto toDto(Notification notification);

    /**
     * Convert Notification entity to NotificationSummaryDto.
     * 
     * @param notification The notification entity
     * @return NotificationSummaryDto
     */
    NotificationSummaryDto toSummaryDto(Notification notification);

    /**
     * Convert list of Notification entities to list of NotificationDto.
     * 
     * @param notifications List of notification entities
     * @return List of NotificationDto
     */
    List<NotificationDto> toDtoList(List<Notification> notifications);

    /**
     * Convert list of Notification entities to list of NotificationSummaryDto.
     * 
     * @param notifications List of notification entities
     * @return List of NotificationSummaryDto
     */
    List<NotificationSummaryDto> toSummaryDtoList(List<Notification> notifications);

    /**
     * Update Notification entity from UpdateNotificationRequest.
     * 
     * @param request      The update request DTO
     * @param notification The notification entity to update
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "nexId", ignore = true)
    @Mapping(target = "type", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    void updateFromRequest(UpdateNotificationRequest request, @MappingTarget Notification notification);
}