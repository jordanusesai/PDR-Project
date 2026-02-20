const Group = require('../models/Group');
const User = require('../models/User');
const crypto = require('crypto');

// Temporarily disabled nodemailer for server startup
// const nodemailer = require('nodemailer');

// Configure nodemailer
// const transporter = nodemailer.createTransporter({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

const generateShareToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const sendGroupInvitation = async (req, res) => {
  try {
    const { groupId, emails, message } = req.body;
    const userId = req.user._id;

    if (!groupId || !emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: 'Group ID and email addresses are required' });
    }

    // Validate group exists and user is a member
    const group = await Group.findOne({
      _id: groupId,
      'members.user': userId,
      isActive: true
    }).populate('members.user', 'username email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found or access denied' });
    }

    // Only allow group creator to send invitations
    if (group.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Only group creator can send invitations' });
    }

    // Generate share token
    const shareToken = generateShareToken();
    const shareLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/group/${groupId}?token=${shareToken}`;

    // Save share token to group
    group.shareToken = shareToken;
    group.shareTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await group.save();

    // Temporarily skip email sending and just return the share link
    // Email functionality can be enabled later by installing nodemailer
    
    res.json({
      message: 'Share link generated successfully (email sending temporarily disabled)',
      shareLink,
      emailsSent: 0,
      note: 'Email functionality requires nodemailer package installation'
    });

  } catch (error) {
    console.error('Send group invitation error:', error);
    res.status(500).json({ message: 'Failed to generate share link' });
  }
};

// Temporarily disabled email functions for server startup
// const generateInvitationEmail = (group, shareLink, inviter, customMessage, existingUser, isAlreadyMember) => {
//   const inviterName = inviter.username;
//   const groupName = group.name;
//   const groupDescription = group.description || 'No description provided';
// 
//   if (isAlreadyMember) {
//     return {
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #6b8dd6;">You're Already a Member!</h2>
//           <p>Hi there,</p>
//           <p>${inviterName} tried to invite you to expense group "${groupName}", but you're already a member of this group.</p>
//           <p>You can access the group directly using the link below:</p>
//           <a href="${shareLink}" style="display: inline-block; background-color: #6b8dd6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">View Group</a>
//           <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
//             <h3>Group Details:</h3>
//             <p><strong>Name:</strong> ${groupName}</p>
//             <p><strong>Description:</strong> ${groupDescription}</p>
//             <p><strong>Members:</strong> ${group.members.length}</p>
//           </div>
//           ${customMessage ? `<p><strong>Personal message from ${inviterName}:</strong></p><p style="font-style: italic;">${customMessage}</p>` : ''}
//           <p>Best regards,<br>The PDR Split Team</p>
//         </div>
//       `
//     };
//   }
// 
//   if (existingUser) {
//     return {
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #6b8dd6;">You've Been Invited to Join an Expense Group!</h2>
//           <p>Hi there,</p>
//           <p>${inviterName} has invited you to join their expense group "${groupName}".</p>
//           <p>Click the link below to join the group:</p>
//           <a href="${shareLink}" style="display: inline-block; background-color: #6b8dd6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Join Group</a>
//           <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
//             <h3>Group Details:</h3>
//             <p><strong>Name:</strong> ${groupName}</p>
//             <p><strong>Description:</strong> ${groupDescription}</p>
//             <p><strong>Members:</strong> ${group.members.length}</p>
//           </div>
//           ${customMessage ? `<p><strong>Personal message from ${inviterName}:</strong></p><p style="font-style: italic;">${customMessage}</p>` : ''}
//           <p>Best regards,<br>The PDR Split Team</p>
//         </div>
//       `
//     };
//   }
// 
//   // New user invitation
//   return {
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #6b8dd6;">You've Been Invited to Join PDR Split!</h2>
//         <p>Hi there,</p>
//         <p>${inviterName} has invited you to join their expense group "${groupName}" on PDR Split.</p>
//         <p>PDR Split helps you track and split expenses with friends, family, and colleagues.</p>
//         <a href="${shareLink}" style="display: inline-block; background-color: #6b8dd6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Sign Up & Join Group</a>
//         <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
//           <h3>Group Details:</h3>
//           <p><strong>Name:</strong> ${groupName}</p>
//           <p><strong>Description:</strong> ${groupDescription}</p>
//           <p><strong>Members:</strong> ${group.members.length}</p>
//         </div>
//         ${customMessage ? `<p><strong>Personal message from ${inviterName}:</strong></p><p style="font-style: italic;">${customMessage}</p>` : ''}
//         <h3>What is PDR Split?</h3>
//         <ul>
//           <li>Track expenses with multiple people</li>
//           <li>Calculate who owes what automatically</li>
//           <li>Support for multiple currencies</li>
//           <li>Mobile-friendly interface</li>
//         </ul>
//         <p>Best regards,<br>The PDR Split Team</p>
//       </div>
//     `
//   };
// };

const validateShareToken = async (req, res) => {
  try {
    const { groupId, token } = req.params;

    const group = await Group.findOne({
      _id: groupId,
      shareToken: token,
      shareTokenExpiry: { $gt: new Date() },
      isActive: true
    });

    if (!group) {
      return res.status(400).json({ message: 'Invalid or expired share link' });
    }

    res.json({
      valid: true,
      group: {
        _id: group._id,
        name: group.name,
        description: group.description,
        members: group.members.length
      }
    });
  } catch (error) {
    console.error('Validate share token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const joinViaShareLink = async (req, res) => {
  try {
    const { groupId, token } = req.params;
    const userId = req.user._id;

    const group = await Group.findOne({
      _id: groupId,
      shareToken: token,
      shareTokenExpiry: { $gt: new Date() },
      isActive: true
    });

    if (!group) {
      return res.status(400).json({ message: 'Invalid or expired share link' });
    }

    // Check if user is already a member
    const isAlreadyMember = group.members.some(member => 
      member.user.toString() === userId.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    // Add user to group
    group.members.push({
      user: userId,
      joinedAt: new Date(),
      role: 'member'
    });

    // Clear share token after successful join
    group.shareToken = undefined;
    group.shareTokenExpiry = undefined;

    await group.save();

    res.json({
      message: 'Successfully joined the group',
      group: {
        _id: group._id,
        name: group.name,
        description: group.description
      }
    });
  } catch (error) {
    console.error('Join via share link error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  sendGroupInvitation,
  validateShareToken,
  joinViaShareLink
};
