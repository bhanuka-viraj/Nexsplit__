package com.nexsplit.mapper.nex;

import com.nexsplit.dto.nex.InvitationDto;
import com.nexsplit.model.NexMember;
import org.mapstruct.*;

import java.util.List;

/**
 * MapStruct mapper for converting between NexMember entities and Invitation
 * DTOs.
 * 
 * This mapper provides type-safe, compile-time generated mapping code for
 * converting between NexMember entities and their corresponding Invitation
 * DTOs.
 * 
 * @author NexSplit Team
 * @version 1.0
 * @since 1.0
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface InvitationMapStruct {

    /**
     * Convert NexMember entity to InvitationDto.
     * 
     * @param nexMember The nex member entity
     * @return InvitationDto
     */
    @Mapping(target = "nexId", source = "id.nexId")
    @Mapping(target = "nexName", source = "nex.name")
    @Mapping(target = "nexDescription", source = "nex.description")
    @Mapping(target = "nexType", source = "nex.nexType")
    @Mapping(target = "settlementType", source = "nex.settlementType")
    @Mapping(target = "nexImageUrl", source = "nex.imageUrl")
    @Mapping(target = "invitedRole", source = "role")
    @Mapping(target = "invitedAt", source = "invitedAt")
    @Mapping(target = "creatorId", source = "nex.createdBy")
    @Mapping(target = "creatorName", source = "nex.creator.firstName")
    @Mapping(target = "creatorUsername", source = "nex.creator.username")
    @Mapping(target = "inviterId", source = "invitedBy")
    @Mapping(target = "inviterName", source = "invitedByUser.firstName")
    @Mapping(target = "inviterUsername", source = "invitedByUser.username")
    @Mapping(target = "inviterEmail", source = "invitedByUser.email")
    InvitationDto toDto(NexMember nexMember);

    /**
     * Convert list of NexMember entities to list of InvitationDto.
     * 
     * @param nexMembers List of nex member entities
     * @return List of InvitationDto
     */
    List<InvitationDto> toDtoList(List<NexMember> nexMembers);
}
