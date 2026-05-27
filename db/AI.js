/* ============================================================
   NEXVOLT — ai.js
   Local analytics engine (no API needed — runs offline)
   ============================================================ */

const AI = (() => {

  const CAT_LABELS = {
    car:       { label: 'Vehicle', icon: '🚗' },
    tools:     { label: 'Tools',   icon: '🔧' },
    materials: { label: 'Materials',icon: '⚡' },
    other:     { label: 'Other',   icon: '📦' },
  };

  function analyze() {
    const s      = DB.stats();
    const inv    = DB.getAll('invoices');
    const exp    = DB.getAll('expenses');
    const clients= DB.getAll('clients');
    const insights = [];

    /* 1 — Unpaid warning */
    if (s.totalUnpaid > 0) {
      const unpaidCount = inv.filter(i => i.status === 'pending').length;
      insights.push({
        icon: '⚠️', color: '#f5a623',
        title: 'Outstanding Payments',
        body: `${fmtTND(s.totalUnpaid)} outstanding across ${unpaidCount} invoice${unpaidCount !== 1 ? 's' : ''}. Follow up with late clients to improve your cash flow.`,
        pct: Math.min(100, (s.totalUnpaid / Math.max(s.totalPaid, 1)) * 100),
      });
    }

    /* 2 — Top expense category (leak) */
    const topCat = Object.entries(s.expByCat).sort((a, b) => b[1] - a[1])[0];
    if (topCat && topCat[1] > 0) {
      const catInfo = CAT_LABELS[topCat[0]] || { label: topCat[0], icon: '📦' };
      const pctOfExp = s.totalExpenses > 0 ? (topCat[1] / s.totalExpenses) * 100 : 0;
      insights.push({
        icon: catInfo.icon, color: '#a855f7',
        title: `Biggest Expense: ${catInfo.label}`,
        body: `${fmtTND(topCat[1])} spent (${pctOfExp.toFixed(0)}% of all expenses). ${_expAdvice(topCat[0])}`,
        pct: pctOfExp,
      });
    }

    /* 3 — Profit margin */
    if (s.totalPaid > 0) {
      const isGood = s.marginPct >= 50;
      insights.push({
        icon: isGood ? '✅' : '📉', color: isGood ? '#22c55e' : '#ef4444',
        title: isGood ? 'Healthy Margin' : 'Margin Below Target',
        body: `Net margin is ${s.marginPct.toFixed(1)}%. ${isGood
          ? 'Great performance — keep material costs tight to stay above 50%.'
          : 'Target is >50% for solo electricians. Review pricing or reduce material waste.'}`,
        pct: Math.min(100, s.marginPct),
      });
    }

    /* 4 — Monthly trend (if enough data) */
    const monthlyData = _monthlyRevenue(inv);
    const months = Object.values(monthlyData);
    if (months.length >= 2) {
      const last  = months[months.length - 1] || 0;
      const prev  = months[months.length - 2] || 0;
      const diff  = last - prev;
      const isUp  = diff >= 0;
      insights.push({
        icon: isUp ? '📈' : '📉', color: isUp ? '#22c55e' : '#f5a623',
        title: isUp ? 'Revenue Growing' : 'Revenue Dipped',
        body: `This month: ${fmtTND(last)}. ${isUp ? '+' : ''}${fmtTND(diff)} vs last month. ${isUp
          ? 'Good momentum — consider upselling maintenance contracts.'
          : 'Slow month. Post on social media or call past clients for follow-up work.'}`,
        pct: prev > 0 ? Math.min(100, Math.abs(diff / prev) * 100) : 50,
      });
    }

    /* 5 — Client value */
    if (clients.length > 0 && s.totalPaid > 0) {
      const avg = s.totalPaid / clients.length;
      insights.push({
        icon: '👤', color: '#3b82f6',
        title: 'Avg Revenue per Client',
        body: `${fmtTND(avg)} per client. ${avg < 500
          ? 'Focus on higher-value jobs (smart home, full installations).'
          : 'Strong client value — loyalty and word-of-mouth are your best marketing.'}`,
        pct: Math.min(100, avg / 10),
      });
    }

    /* 6 — No data yet */
    if (insights.length === 0) {
      insights.push({
        icon: '🤖', color: '#8888aa',
        title: 'Analytics ready',
        body: 'Add invoices and expenses to see your financial insights, leaks, and growth trends here.',
        pct: 0,
      });
    }

    return { insights, stats: s, monthly: monthlyData };
  }

  function _expAdvice(cat) {
    return {
      car:       'Track fuel per job to see if travel costs are eating your margin.',
      tools:     'Good tools are an investment — but compare suppliers for consumables.',
      materials: 'Buy materials in bulk for recurring projects to cut unit cost.',
      other:     'Review miscellaneous costs — some may be reclassifiable as deductible.',
    }[cat] || '';
  }

  function _monthlyRevenue(invoices) {
    const map = {};
    invoices
      .filter(i => i.status === 'paid')
      .forEach(i => {
        if (!i.date) return;
        const d = new Date(i.date);
        const k = d.getFullYear() + '-' + String(d.getMonth()).padStart(2, '0');
        map[k] = (map[k] || 0) + (i.ttc || 0);
      });
    return map;
  }

  function monthlyChart(invoices, expenses) {
    /* Returns last 6 months data for a simple bar chart */
    const now     = new Date();
    const result  = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth(), y = d.getFullYear();
      const rev = invoices
        .filter(inv => { const dd = new Date(inv.date); return dd.getMonth() === m && dd.getFullYear() === y && inv.status === 'paid'; })
        .reduce((a, inv) => a + (inv.ttc || 0), 0);
      const exp = expenses
        .filter(e => { const dd = new Date(e.date); return dd.getMonth() === m && dd.getFullYear() === y; })
        .reduce((a, e) => a + (e.amount || 0), 0);
      result.push({ label: monthName(m), rev, exp, profit: rev - exp });
    }
    return result;
  }

  return { analyze, monthlyChart };
})();
