// lab.js

// 模拟现实市场价格
const marketPrices = {
    'USDT': 7.24,
    'USDC': 7.25
};

// 状态管理：尝试从本地存储读取数据，如果没有则初始化十万本金
let userData = JSON.parse(localStorage.getItem('wenjie_user')) || {
    cny: 100000.00,
    assets: { USDT: 0, USDC: 0 },
    isNewUser: true
};

let currentTradeCoin = '';

// 初始化页面
function init() {
    updateUI();
    // 如果是新用户，显示新手引导
    if (userData.isNewUser) {
        document.getElementById('tutorial-overlay').classList.add('active');
    } else {
        document.getElementById('tutorial-overlay').classList.remove('active');
    }
}

// 更新界面数据
function updateUI() {
    document.getElementById('cny-balance').innerText = '¥' + userData.cny.toFixed(2);
    document.getElementById('hold-usdt').innerText = userData.assets.USDT.toFixed(2);
    document.getElementById('hold-usdc').innerText = userData.assets.USDC.toFixed(2);
    
    // 保存到本地存储
    localStorage.setItem('wenjie_user', JSON.stringify(userData));
}

// 关闭新手引导
function closeTutorial() {
    userData.isNewUser = false;
    document.getElementById('tutorial-overlay').classList.remove('active');
    updateUI();
}

// 重置账户 (方便测试)
function resetAccount() {
    if(confirm("确定要重置账户吗？这将清空你的数字资产并恢复十万本金。")) {
        userData = { cny: 100000.00, assets: { USDT: 0, USDC: 0 }, isNewUser: true };
        init();
    }
}

// 打开交易面板
function openTrade(coin) {
    currentTradeCoin = coin;
    document.getElementById('trade-panel').classList.remove('hidden');
    document.getElementById('trade-title').innerText = `买入 ${coin}`;
    document.getElementById('trade-amount').value = '';
    document.getElementById('trade-cost').innerText = '¥0.00';
    
    // 监听输入，实时计算花费
    document.getElementById('trade-amount').addEventListener('input', function(e) {
        let amount = parseFloat(e.target.value) || 0;
        let cost = amount * marketPrices[currentTradeCoin];
        document.getElementById('trade-cost').innerText = '¥' + cost.toFixed(2);
    });
}

// 取消交易
function closeTrade() {
    document.getElementById('trade-panel').classList.add('hidden');
}

// 确认执行交易
document.getElementById('btn-execute').addEventListener('click', function() {
    let amount = parseFloat(document.getElementById('trade-amount').value);
    
    if (!amount || amount <= 0) {
        alert("请输入有效的数量！");
        return;
    }

    let cost = amount * marketPrices[currentTradeCoin];

    if (userData.cny < cost) {
        alert("余额不足！你的模拟人民币不够买这么多。");
        return;
    }

    // 扣款与增加资产
    userData.cny -= cost;
    userData.assets[currentTradeCoin] += amount;
    
    alert(`🎉 交易成功！你花费了 ¥${cost.toFixed(2)} 买入了 ${amount} ${currentTradeCoin}。\n\n【合规提示】在现实中，此类交易不受法律保护，请注意风险。`);
    
    closeTrade();
    updateUI();
});

// 页面加载时执行
window.onload = init;
