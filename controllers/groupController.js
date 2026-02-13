const Group = require('../models/Group');
const User = require('../models/User');

const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    const group = new Group({
      name,
      description,
      createdBy: req.user._id,
      members: [{ user: req.user._id }]
    });

    await group.save();
    await group.populate('members.user', 'username email avatar');
    await group.populate('createdBy', 'username email avatar');

    res.status(201).json({
      message: 'Group created successfully',
      group
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      'members.user': req.user._id,
      isActive: true
    })
    .populate('members.user', 'username email avatar')
    .populate('createdBy', 'username email avatar')
    .sort({ updatedAt: -1 });

    res.json({ groups });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getGroupById = async (req, res) => {
  try {
    const group = await Group.findOne({
      _id: req.params.groupId,
      'members.user': req.user._id,
      isActive: true
    })
    .populate('members.user', 'username email avatar')
    .populate('createdBy', 'username email avatar');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json({ group });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const { groupId } = req.params;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const group = await Group.findOne({
      _id: groupId,
      'members.user': req.user._id,
      isActive: true
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isAlreadyMember = group.members.some(
      member => member.user.toString() === userToAdd._id.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    group.members.push({ user: userToAdd._id });
    await group.save();
    await group.populate('members.user', 'username email avatar');

    res.json({
      message: 'Member added successfully',
      group
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    const group = await Group.findOne({
      _id: groupId,
      'members.user': req.user._id,
      isActive: true
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Cannot remove the creator
    if (group.createdBy.toString() === userId) {
      return res.status(400).json({ message: 'Cannot remove group creator' });
    }

    group.members = group.members.filter(
      member => member.user.toString() !== userId
    );

    await group.save();
    await group.populate('members.user', 'username email avatar');

    res.json({
      message: 'Member removed successfully',
      group
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createGroup,
  getUserGroups,
  getGroupById,
  addMember,
  removeMember
};
