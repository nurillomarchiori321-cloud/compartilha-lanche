const express = require('express');
const router = express.Router();
const User = require('../models/User');
const SnackContribution = require('../models/SnackContribution');
const bcrypt = require('bcryptjs');
router.get('/', async function(req, res, next) {
  try {
    const snacks = await SnackContribution.findAll({
      include: [User],
      order: [['date', 'ASC']],
      limit: 3
    });
    
    res.render('index', { 
      title: 'Compartilha Lanche',
      user: req.session.user || null,
      snacks: snacks
    });
  } catch (error) {
    res.render('index', { 
      title: 'Compartilha Lanche',
      user: req.session.user || null,
      snacks: []
    });
  }
});
router.get('/register', (req, res) => {
  res.render('register', { 
    title: 'Cadastro',
    message: null,
    user: req.session.user || null
  });
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.render('register', { 
        title: 'Cadastro',
        message: 'Email já cadastrado!',
        user: req.session.user || null
      });
    }
    
    await User.create({ name, email, password });
    res.redirect('/login');
  } catch (error) {
    res.render('register', { 
      title: 'Cadastro',
      message: 'Erro ao cadastrar. Tente novamente.',
      user: req.session.user || null
    });
  }
});
router.get('/login', (req, res) => {
  res.render('login', { 
    title: 'Login',
    message: null,
    user: req.session.user || null
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render('login', { 
        title: 'Login',
        message: 'Email ou senha inválidos!',
        user: null
      });
    }
    
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.render('login', { 
        title: 'Login',
        message: 'Email ou senha inválidos!',
        user: null
      });
    }
    
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };
    
    res.redirect('/');
  } catch (error) {
    res.render('login', { 
      title: 'Login',
      message: 'Erro ao fazer login. Tente novamente.',
      user: null
    });
  }
});
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
router.get('/snacks', async (req, res) => {
  try {
    const snacks = await SnackContribution.findAll({
      include: [User],
      order: [['date', 'ASC']]
    });
    
    res.render('snacks', { 
      title: 'Lanches',
      snacks: snacks,
      user: req.session.user || null
    });
  } catch (error) {
    res.render('snacks', { 
      title: 'Lanches',
      snacks: [],
      user: req.session.user || null
    });
  }
});
router.get('/snacks/new', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  
  res.render('snacks_new', { 
    title: 'Novo Lanche',
    message: null,
    user: req.session.user || null
  });
});

router.post('/snacks', async (req, res) => {
  if (!req.session.user) {
    console.log(' Usuário não logado');
    return res.redirect('/login');
  }
  
  try {
    const { item, date } = req.body;
    
    console.log(' Dados recebidos:', { item, date, userId: req.session.user.id });
    
    if (!item || item.trim() === '') {
      console.log(' Item vazio');
      return res.render('snacks_new', { 
        title: 'Novo Lanche',
        message: 'Item do lanche não pode estar vazio!',
        user: req.session.user || null
      });
    }
    
    if (!date || date.trim() === '') {
      console.log(' Data vazia');
      return res.render('snacks_new', { 
        title: 'Novo Lanche', 
        message: 'Data não pode estar vazia!',
        user: req.session.user || null
      });
    }
    
    const existing = await SnackContribution.findOne({
      where: {
        userId: req.session.user.id,
        date: date
      }
    });
    
    if (existing) {
      console.log(' Contribuição duplicada');
      return res.render('snacks_new', { 
        title: 'Novo Lanche',
        message: 'Você já tem uma contribuição para esta data!',
        user: req.session.user || null
      });
    }
    
    console.log(' Criando lanche...');
    await SnackContribution.create({
      item: item.trim(),
      date: date,
      userId: req.session.user.id
    });
    
    console.log(' Lanche criado com sucesso!');
    return res.redirect('/snacks');
    
  } catch (error) {
    console.error(' ERRO:', error.message);
    return res.status(200).render('snacks_new', { 
      title: 'Novo Lanche',
      message: 'Erro: ' + error.message,
      user: req.session.user || null
    });
  }
});
router.get('/snacks/:id/edit', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  
  try {
    const snack = await SnackContribution.findByPk(req.params.id);
    
    if (!snack) {
      return res.redirect('/snacks');
    }
    
    if (snack.userId !== req.session.user.id) {
      return res.redirect('/snacks');
    }
    
    res.render('snacks_edit', { 
      title: 'Editar Lanche',
      snack: snack,
      message: null,
      user: req.session.user || null
    });
  } catch (error) {
    res.redirect('/snacks');
  }
});

router.post('/snacks/:id/edit', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  
  try {
    const { item, date } = req.body;
    const snack = await SnackContribution.findByPk(req.params.id);
    
    if (!snack) {
      return res.redirect('/snacks');
    }
    
    if (snack.userId !== req.session.user.id) {
      return res.redirect('/snacks');
    }
    
    if (!item || item.trim() === '') {
      return res.render('snacks_edit', { 
        title: 'Editar Lanche',
        snack: snack,
        message: 'Item do lanche não pode estar vazio!',
        user: req.session.user || null
      });
    }
    
    if (!date || date.trim() === '') {
      return res.render('snacks_edit', { 
        title: 'Editar Lanche',
        snack: snack,
        message: 'Data não pode estar vazia!',
        user: req.session.user || null
      });
    }
    
    await snack.update({
      item: item.trim(),
      date: date
    });
    
    res.redirect('/snacks');
  } catch (error) {
    res.redirect('/snacks');
  }
});
router.post('/snacks/:id/delete', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  
  try {
    const snack = await SnackContribution.findByPk(req.params.id);
    
    if (!snack) {
      return res.redirect('/snacks');
    }
    
    if (snack.userId !== req.session.user.id) {
      return res.redirect('/snacks');
    }
    
    await snack.destroy();
    res.redirect('/snacks');
  } catch (error) {
    res.redirect('/snacks');
  }
});

module.exports = router;