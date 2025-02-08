async function checkRoleInformation(message, roleId) {
    try {
        const role = message.guild.roles.cache.get(roleId)

        const permissions = role.permissions.toArray()
        const permissionsText = permissions.length > 0 ? permissions.join(', ') : "Không có quyền nào"

        const fetchedMembers = await message.guild.members.fetch()
        const membersWithRole = fetchedMembers
                                            .filter(member => member.roles.cache.has(role.id))
                                            .map(member => member.user.username)
                                            .join(", ") || "Không có ai";     

        const sortedRoles = [...message.guild.roles.cache.values()]
                                                         .sort((a, b) => b.position - a.position); // Sắp xếp theo thứ tự từ cao đến thấp

        const roleIndex = sortedRoles.findIndex(r => r.id === role.id);
        const higherRole = roleIndex > 0 ? sortedRoles[roleIndex - 1].name : "Không có";
        const lowerRole = roleIndex < sortedRoles.length - 1 ? sortedRoles[roleIndex + 1].name : "Không có";

        const totalAllRoles = message.guild.roles.cache.size
        const displayPositionRole = totalAllRoles - role.position // Vì cách tính role của discord hơi ngược

        const roleInfo = `**Thông tin Role:**\n` +
        `- **Tên:** ${role.name}\n` +
        `- **ID:** ${roleId}\n` + 
        `- **Màu sắc:** ${role.hexColor}\n` +
        `- **Vai trò riêng biệt:** ${role.hoist ? 'có' : 'không'}\n` +
        `- **Có thể được mention:** ${role.mentionable ? 'có' : 'không'}\n` +
        `- **Vị trí trong server:** ${displayPositionRole}\n` +
        `- **Role cao hơn:** ${higherRole}\n` +
        `- **Role thấp hơn:** ${lowerRole}\n` +
        `- **Những người sở hữu role:** ${membersWithRole}\n` +
        `- **Quyền hạn:** ${permissionsText}\n`

        await message.reply(roleInfo)
    } catch (error) {
        console.error(error)
        await message.reply('❌ Đã xảy ra lỗi khi nhập')
    }
}

module.exports = { checkRoleInformation }