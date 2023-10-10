const Expense = require('../models/expense');

exports.createExpense = async (req, res, next) => {
    try {
      const { amount, description, category } = req.body;
  
      const newExpense = await Expense.create({
        amount,
        description,
        category,
        trackerId : req.user.id
      });
  
      res.status(201).json(newExpense);
    } catch (error) {
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
    try {
      const id = req.params.Id;
      console.log(req.user.id,id);
      const expense = await Expense.findByPk(id);
  console.log(expense);
 
      if (!expense) {
        return res.status(404).json({ err: 'Expense not found' });
      }
  
      const resp=await Expense.destroy({where:{id:id,trackerId : req.user.id}});
      if(resp ===0){
        throw new Error('user cannot find');
      }
  console.log(resp);
      res.status(204).json({ message: 'Expense deleted successfully' });
    } catch (error) {

      console.error('Error deleting expense:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  
  exports.updateExpense = async (req, res, next) => {
    try {
      const id = req.params.Id;
      const { amount, description, category } = req.body;
  
      const expense = await Expense.findByPk(id);
  
      if (!expense) {
        return res.status(404).json({ err: 'Expense not found' });
      }
  
      await expense.update({ amount, description, category });
  
      res.status(200).json({ message: 'Expense updated successfully' });
    } catch (error) {
      console.error('Error updating expense:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  