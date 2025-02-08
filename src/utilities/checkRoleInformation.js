const { splitMessage } = require("../helper/split_message");

async function checkRoleInformation(message, roleId) {
    try {
        const role = message.guild.roles.cache.get(roleId)

        const permissions = role.permissions.toArray()
        const permissionsText = permissions.length > 0 ? permissions.join(', ') : "Không có quyền nào"

        const fetchedMembers = await message.guild.members.fetch()
        const membersWithRole = fetchedMembers
                                            .filter(member => member.roles.cache.has(role.id))
                                            .map(member => `\`${member.user.username}\``) // Phá markdown của discord
                                            .join(", ") || "Không có ai";

        // Lấy danh sách member nhận role trong vòng 1 ngày đầu tiên
        const oneDayAfterCreation = new Date(role.createdAt);
        oneDayAfterCreation.setDate(oneDayAfterCreation.getDate() + 1);

        const membersJoinedEarlyDay = fetchedMembers
                                            .filter(member => member.roles.cache.has(role.id) && member.joinedAt <= oneDayAfterCreation)
                                            .map(member => `\`${member.user.username}\``)
                                            .join(", ") || "Không có ai";

        // Lấy danh sách member nhận role trong vòng 1 tháng đầu tiên
        const oneMonthAfterCreation = new Date(role.createdAt);
        oneMonthAfterCreation.setMonth(oneMonthAfterCreation.getMonth() + 1);

        const membersJoinedEarlyMonth = fetchedMembers
                                            .filter(member => member.roles.cache.has(role.id) && member.joinedAt <= oneMonthAfterCreation)
                                            .map(member => `\`${member.user.username}\``)
                                            .join(", ") || "Không có ai";  
        
        // Lấy danh sách member nhận role trong vòng 1 năm đầu tiên
        const oneYearAfterCreation = new Date(role.createdAt);
        oneYearAfterCreation.setFullYear(oneYearAfterCreation.getFullYear() + 1);

        const membersJoinedEarlyYear = fetchedMembers
                                            .filter(member => member.roles.cache.has(role.id) && member.joinedAt <= oneYearAfterCreation)
                                            .map(member => `\`${member.user.username}\``)
                                            .join(", ") || "Không có ai";
        // -------------------------------
        // Xác định người sở hữu role lâu nhất và người sở hữu role đầu tiên dựa vào thời gian tham gia server
        const membersWithRoleArray = fetchedMembers.filter(member => member.roles.cache.has(role.id));
        // Sắp xếp theo thời gian tham gia server (joinedTimestamp: số ms kể từ epoch)
        const sortedMembersByJoin = Array.from(membersWithRoleArray.values())
            .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);

        // Người sở hữu role lâu nhất (sinh viên vào server sớm nhất)
        const longestOwnedMember = sortedMembersByJoin.length > 0 ? sortedMembersByJoin[0].user.username : "Không có ai";
        
        // Người sở hữu role đầu tiên (người được gán role sau khi role được tạo)
        // Ta lấy những thành viên mà thời gian tham gia (joinedAt) sau thời gian tạo role, sau đó chọn người tham gia sớm nhất.
        const membersAssignedAfterCreation = sortedMembersByJoin.filter(member => member.joinedAt > role.createdAt);
        const firstAssignedMember = membersAssignedAfterCreation.length > 0 ? membersAssignedAfterCreation[0].user.username : longestOwnedMember;
        // Sau đó, khi hiển thị, bọc bằng backticks
        const formattedLongestOwnedMember = `\`${longestOwnedMember}\``;
        const formattedFirstAssignedMember = `\`${firstAssignedMember}\``;
        
        //------------------------------
        const sortedRoles = [...message.guild.roles.cache.values()]
                                                         .sort((a, b) => b.position - a.position); // Sắp xếp theo thứ tự từ cao đến thấp

        const roleIndex = sortedRoles.findIndex(r => r.id === role.id);
        const higherRole = roleIndex > 0 ? sortedRoles[roleIndex - 1].name : "Không có";
        const lowerRole = roleIndex < sortedRoles.length - 1 ? sortedRoles[roleIndex + 1].name : "Không có";

        const totalAllRoles = message.guild.roles.cache.size
        const displayPositionRole = totalAllRoles - role.position // Vì cách tính role của discord hơi ngược

        const roleInfo = `**📇 Thông tin Role:**\n` +
        `- **Tên:** ${role.name}\n` +
        `- **ID:** ${roleId}\n` +
        `- **Ngày được tạo:** ${role.createdAt.toLocaleDateString("vi-VN")}\n` +
        `- **Màu sắc:** ${role.hexColor}\n` +
        `- **Vai trò riêng biệt:** ${role.hoist ? 'có' : 'không'}\n` +
        `- **Có thể được mention:** ${role.mentionable ? 'có' : 'không'}\n` +
        `- **Vị trí trong server:** ${displayPositionRole}\n` +
        `- **Role cao hơn:** ${higherRole}\n` +
        `- **Role thấp hơn:** ${lowerRole}\n` +
        `- **Quyền hạn:** ${permissionsText}\n` +
        `- **Những người sở hữu role ở hiện tại:** ${membersWithRole}\n\n` +

        `👁‍🗨 **Những người sở hữu role**\n` +
        `- **Sớm nhất:** ${formattedFirstAssignedMember}\n` +
        `- **Lâu nhất:** ${formattedLongestOwnedMember}\n` +
        `- **Ngày đầu tiên:** ${membersJoinedEarlyDay}\n` +
        `- **Tháng đầu tiên:** ${membersJoinedEarlyMonth}\n` +
        `- **Năm đầu tiên:** ${membersJoinedEarlyYear}\n` 

        const formatInfo = splitMessage(roleInfo)
        for (const chunk of formatInfo){
        await message.reply(chunk)
        }
    } catch (error) {
        console.error(error)
        await message.reply('❌ Đã xảy ra lỗi khi nhập')
    }
}

module.exports = { checkRoleInformation }