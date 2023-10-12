const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');
exports.createExpense = async (req, res, next) => {
  const trans =  await sequelize.transaction();
    try {
      const {amount, description, category } = req.body;

      if (!amount || !description || !category) {
        return res.status(400).json({ error: 'Missing or invalid data' });
      }
      const newExpense = await Expense.create({
        amount,
        description,
        category,
        trackerId : req.user.id
      },{transaction:trans});
      const totalExp = Number(req.user.totalExpenses) + Number(amount);
      console.log(totalExp)
      await User.update({ totalExpenses:totalExp}, { where: { id: req.user.id },transaction:trans});
      await trans.commit();
      res.status(201).json(newExpense);
    } catch (error) {
      await trans.rollback();
      console.error('Error creating expense:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  exports.getAllExpenses = async (req, res, next) => {
    try {
     
      const expenses = await req.user.getExpenses();
      res.json(expenses);
    } catch (error) {
      console.log('Error retrieving expenses:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  exports.deleteExpense = async (req, res, next) => {
    const tran = await sequelize.transaction();
  
    try {
      const id = req.params.Id;
      const expense = await Expense.findByPk(id, { transaction: tran });
  
      if (!expense) {
        await tran.rollback();
        return res.status(404).json({ err: 'Expense not found' });
      }
  
      if (expense.trackerId !== req.user.id) {
        await tran.rollback();
        return res.status(403).json({ err: 'Permission denied' });
      }
      
      await Expense.destroy({ where: { id: id, trackerId: req.user.id }, transaction: tran });
      const totalExp = Number(req.user.totalExpenses) - Number(expense.amount);
      console.log(totalExp);
      await User.update({ totalExpenses:totalExp}, { where: { id: req.user.id },transaction:tran});
      await tran.commit();
  
      res.status(204).json({ message: 'Expense deleted successfully' });
    } catch (error) {
      await tran.rollback();
      console.error('Error deleting expense:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  exports.updateExpense = async (req, res, next) => {
    const tr = await sequelize.transaction();
  
    try {
      const id = req.params.Id;
      const { amount, description, category } = req.body;
  
      
      if (typeof amount !== 'number' || description.length === 0 || category.length === 0) {
        await tr.rollback();
        return res.status(400).json({ error: 'Invalid or missing data' });
      }
  
      const expense = await Expense.findByPk(id, { transaction: tr });
  
      if (!expense) {
        await tr.rollback();
        return res.status(404).json({ error: 'Expense not found' });
      }
  
      await expense.update(
        { amount, description, category },
        { transaction: tr }
      );
  
      await tr.commit();
  
      res.status(200).json({ message: 'Expense updated successfully' });
    } catch (error) {
      await tr.rollback();
      console.error('Error updating expense:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  