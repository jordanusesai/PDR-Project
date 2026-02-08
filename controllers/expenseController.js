const Expense = require('../models/Expense');
const Group = require('../models/Group');

const createExpense = async (req, res) => {
  try {
    const {
      title,
      amount,
      currency,
      conversionRate,
      expenseType,
      description,
      group,
      paidBy,
      splitBetween
    } = req.body;

    // Validation
    if (!title || !amount || !expenseType || !group || !paidBy || !splitBetween) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    if (conversionRate && conversionRate <= 0) {
      return res.status(400).json({ message: 'Conversion rate must be greater than 0' });
    }

    // Check if user is member of the group
    const groupDoc = await Group.findOne({
      _id: group,
      'members.user': req.user._id,
      isActive: true
    });

    if (!groupDoc) {
      return res.status(404).json({ message: 'Group not found or access denied' });
    }

    // Validate that all split users are group members
    const groupMemberIds = groupDoc.members.map(m => m.user.toString());
    const invalidSplitUsers = splitBetween.filter(
      userId => !groupMemberIds.includes(userId)
    );

    if (invalidSplitUsers.length > 0) {
      return res.status(400).json({ message: 'Some users are not members of this group' });
    }

    const expense = new Expense({
      title,
      amount,
      currency: currency || 'GBP',
      conversionRate: conversionRate || 1.00,
      expenseType,
      description,
      group,
      paidBy,
      splitBetween,
      createdBy: req.user._id
    });

    await expense.save();
    await expense.populate([
      { path: 'group', select: 'name' },
      { path: 'paidBy', select: 'username email avatar' },
      { path: 'splitBetween.user', select: 'username email avatar' },
      { path: 'createdBy', select: 'username email avatar' }
    ]);

    res.status(201).json({
      message: 'Expense created successfully',
      expense
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Check if user is member of the group
    const group = await Group.findOne({
      _id: groupId,
      'members.user': req.user._id,
      isActive: true
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found or access denied' });
    }

    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy', 'username email avatar')
      .populate('splitBetween.user', 'username email avatar')
      .populate('createdBy', 'username email avatar')
      .sort({ createdAt: -1 });

    res.json({ expenses });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const updates = req.body;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check if user is member of the group
    const group = await Group.findOne({
      _id: expense.group,
      'members.user': req.user._id,
      isActive: true
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found or access denied' });
    }

    // Only creator or paidBy can update
    if (expense.createdBy.toString() !== req.user._id.toString() &&
        expense.paidBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this expense' });
    }

    // Validate splitBetween if provided
    if (updates.splitBetween) {
      const groupMemberIds = group.members.map(m => m.user.toString());
      const invalidSplitUsers = updates.splitBetween.filter(
        userId => !groupMemberIds.includes(userId)
      );

      if (invalidSplitUsers.length > 0) {
        return res.status(400).json({ message: 'Some users are not members of this group' });
      }
    }

    Object.assign(expense, updates);
    await expense.save();
    await expense.populate([
      { path: 'group', select: 'name' },
      { path: 'paidBy', select: 'username email avatar' },
      { path: 'splitBetween.user', select: 'username email avatar' },
      { path: 'createdBy', select: 'username email avatar' }
    ]);

    res.json({
      message: 'Expense updated successfully',
      expense
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check if user is member of the group
    const group = await Group.findOne({
      _id: expense.group,
      'members.user': req.user._id,
      isActive: true
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found or access denied' });
    }

    // Only creator or paidBy can delete
    if (expense.createdBy.toString() !== req.user._id.toString() &&
        expense.paidBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    await Expense.findByIdAndDelete(expenseId);

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const calculateBalances = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Check if user is member of the group
    const group = await Group.findOne({
      _id: groupId,
      'members.user': req.user._id,
      isActive: true
    }).populate('members.user', 'username email avatar');

    if (!group) {
      return res.status(404).json({ message: 'Group not found or access denied' });
    }

    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy', 'username email avatar')
      .populate('splitBetween.user', 'username email avatar');

    // Calculate balances
    const balances = {};
    
    // Initialize balances for all members
    group.members.forEach(member => {
      balances[member.user._id.toString()] = {
        user: member.user,
        totalPaid: 0,
        totalOwed: 0,
        balance: 0
      };
    });

    // Calculate totals
    expenses.forEach(expense => {
      const paidById = expense.paidBy._id.toString();
      const amountPerPerson = expense.amountGBP / expense.splitBetween.length;

      // Add to paid by user
      if (balances[paidById]) {
        balances[paidById].totalPaid += expense.amountGBP;
      }

      // Add to each person's share
      expense.splitBetween.forEach(person => {
        const userId = person.user._id.toString();
        if (balances[userId]) {
          balances[userId].totalOwed += amountPerPerson;
        }
      });
    });

    // Calculate final balance
    Object.keys(balances).forEach(userId => {
      balances[userId].balance = balances[userId].totalPaid - balances[userId].totalOwed;
    });

    res.json({ balances });
  } catch (error) {
    console.error('Calculate balances error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createExpense,
  getGroupExpenses,
  updateExpense,
  deleteExpense,
  calculateBalances
};
