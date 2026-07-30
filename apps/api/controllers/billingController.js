import { invoices, users } from '../models/db.js';

const PLANS = [
  { id: 'free', name: 'Free Plan', price: 0, interval: 'month', features: ['100 API Requests/day', 'Standard Analytics Dashboard', '1 User Access'] },
  { id: 'pro', name: 'Pro Plan', price: 29, interval: 'month', features: ['Unlimited Requests', 'Real-Time WebSockets', 'AI Analytics Reports', 'Dedicated Support'] },
  { id: 'enterprise', name: 'Enterprise Plan', price: 99, interval: 'month', features: ['All Pro Features', 'Multi-User Organization', 'Custom API Integrations', '99.9% SLA Guarantee', '24/7 Phone Support'] }
];

export const getPlans = (req, res) => {
  res.json({ success: true, plans: PLANS });
};

export const createCheckoutSession = async (req, res) => {
  const { planId, cardNumber, cardExpiry, cardCvc } = req.body;
  const user = req.user;

  if (!planId) {
    return res.status(400).json({ success: false, message: 'Plan ID gereklidir.' });
  }

  const selectedPlan = PLANS.find(p => p.id === planId);
  if (!selectedPlan) {
    return res.status(404).json({ success: false, message: 'Plan bulunamadı.' });
  }

  // Ödeme ve 3D Secure onaylama simülasyonu
  console.log(`💳 Simulating checkout for ${user.email} -> Plan: ${selectedPlan.name}`);

  // Basit kart doğrulama simülasyonu (kart girildiyse)
  if (cardNumber && cardNumber.replace(/\s/g, '').length !== 16) {
    return res.status(400).json({ success: false, message: 'Geçersiz kredi kartı numarası. (16 hane olmalıdır)' });
  }

  // Adım 1: Kullanıcı aboneliğini veritabanında güncelle
  const dbUser = users.find(u => u.id === user.id);
  if (dbUser) {
    dbUser.subscriptionPlan = planId;
  }
  user.subscriptionPlan = planId;

  // Adım 2: Fatura oluştur ve ekle
  const invoiceId = 'INV-' + Math.floor(1000 + Math.random() * 9000);
  const newInvoice = {
    id: invoiceId,
    userId: user.id,
    userEmail: user.email,
    planName: selectedPlan.name,
    amount: selectedPlan.price,
    date: new Date().toISOString().split('T')[0],
    status: 'Paid',
    paymentMethod: cardNumber ? `Visa Ending **** ${cardNumber.slice(-4)}` : 'Simulated Checkout'
  };

  invoices.push(newInvoice);

  res.json({
    success: true,
    message: 'Ödeme başarıyla simüle edildi ve abonelik tanımlandı.',
    subscriptionPlan: planId,
    invoice: newInvoice
  });
};

export const handleWebhook = (req, res) => {
  const { eventType, data } = req.body;
  console.log(`🔔 Stripe Webhook Received: Event -> ${eventType}`);
  res.json({ received: true, event: eventType });
};

export const getBillingHistory = (req, res) => {
  const userInvoices = invoices.filter(inv => inv.userId === req.user.id);
  
  // Eğer fatura geçmişi boşsa, ilk kez giren kullanıcı için varsayılan bir başlangıç faturası ekleyelim
  if (userInvoices.length === 0) {
    const defaultInvoice = {
      id: 'INV-1024',
      userId: req.user.id,
      userEmail: req.user.email,
      planName: req.user.subscriptionPlan === 'pro' ? 'Pro Plan' : req.user.subscriptionPlan === 'enterprise' ? 'Enterprise Plan' : 'Free Plan',
      amount: req.user.subscriptionPlan === 'pro' ? 29 : req.user.subscriptionPlan === 'enterprise' ? 99 : 0,
      date: '2026-07-01',
      status: 'Paid',
      paymentMethod: 'System Initialized'
    };
    invoices.push(defaultInvoice);
    userInvoices.push(defaultInvoice);
  }

  res.json({ success: true, history: userInvoices });
};
