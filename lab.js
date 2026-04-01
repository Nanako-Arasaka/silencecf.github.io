// lab.js

// 模拟现实市场价格
const marketPrices = { 'USDT': 7.24, 'USDC': 7.25 };

// 初始化用户数据 (增加积分系统和装扮状态)
let userData = JSON.parse(localStorage.getItem('wenjie_user')) || {
    cny: 100000.00,
    points: 0,
    assets: { USDT: 0, USDC: 0 },
    hasPremiumSkin: false,
    isNewUser: true
};

let currentTradeCoin = '';

// 初始化页面
function init() {
    updateUI();
    renderLeaderboard();
    if (userData.isNewUser) {
        document.getElementById('tutorial-overlay').classList.add('active');
    }
}

// 更新界面数据
function updateUI() {
    document.getElementById('cny-balance').innerText = '¥' + userData.cny.toFixed(2);
    document.getElementById('user-points').innerText = userData.points;
    document.getElementById('hold-usdt').innerText = userData.assets.USDT.toFixed(2);
    document.getElementById('hold-usdc').innerText = userData.assets.USDC.toFixed(2);
    
    // 如果购买了高级头像框
    if (userData.hasPremiumSkin) {
        document.getElementById('user-avatar').classList.add('premium');
    }
    
    localStorage.setItem('wenjie_user', JSON.stringify(userData));
    renderLeaderboard(); // 每次资产变动刷新排行榜
}

// 关闭新手引导
function closeTutorial() {
    userData.isNewUser = false;
    document.getElementById('tutorial-overlay').classList.remove('active');
    updateUI();
}

// 模拟观看视频赚取积分
function earnPoints(amount) {
    userData.points += amount;
    alert(`✅ 学习完成！你深刻理解了稳定币的合规边界。\n获得奖励：${amount} 学习积分！`);
    updateUI();
}

// 交易相关逻辑
function openTrade(coin) {
    currentTradeCoin = coin;
    document.getElementById('trade-panel').classList.remove('hidden');
    document.getElementById('trade-title').innerText = `买入 ${coin}`;
    document.getElementById('trade-amount').value = '';
    document.getElementById('trade-cost').innerText = '¥0.00';
    
    document.getElementById('trade-amount').addEventListener('input', function(e) {
        let amount = parseFloat(e.target.value) || 0;
        let cost = amount * marketPrices[currentTradeCoin];
        document.getElementById('trade-cost').innerText = '¥' + cost.toFixed(2);
    });
}

function closeTrade() {
    document.getElementById('trade-panel').classList.add('hidden');
}

document.getElementById('btn-execute').addEventListener('click', function() {
    let amount = parseFloat(document.getElementById('trade-amount').value);
    if (!amount || amount <= 0) return alert("请输入有效的数量！");
    let cost = amount * marketPrices[currentTradeCoin];
    if (userData.cny < cost) return alert("余额不足！");

    userData.cny -= cost;
    userData.assets[currentTradeCoin] += amount;
    
    alert(`🎉 交易成功！模拟买入 ${amount} ${currentTradeCoin}。`);
    closeTrade();
    updateUI();
});

// 商城购买逻辑
function buyItem(type) {
    if (type === 'skin') {
        if (userData.hasPremiumSkin) return alert("你已经拥有该装扮！");
        if (userData.points < 500) return alert("学习积分不足！多去看教育视频吧。");
        userData.points -= 500;
        userData.hasPremiumSkin = true;
        alert("🎁 兑换成功！已为你装备【高级头像框】。");
    } else if (type === 'book') {
        if (userData.cny < 49) return alert("模拟本金不足！");
        userData.cny -= 49;
        alert("📚 购买成功！实体书籍《区块链合规》模拟发货中...");
    } else if (type === 'expert') {
        if (userData.cny < 199) return alert("模拟本金不足！");
        userData.cny -= 199;
        alert("👨‍🏫 预约成功！已扣除 ¥199 模拟费用，专家将很快与您联系。");
    }
    updateUI();
}

// 生成排行榜 (加入当前用户进行排行)
function renderLeaderboard() {
    // 计算用户当前总资产估值 (本金 + 稳定币折算)
    let userTotalValue = userData.cny + (userData.assets.USDT * marketPrices['USDT']) + (userData.assets.USDC * marketPrices['USDC']);
    
    // 模拟好友数据
    let friends = [
        { name: '王同学 (清华)', val: 105200.50 },
        { name: '李同学 (北大)', val: 101300.00 },
        { name: '张同学 (复旦)', val: 98000.00 },
        { name: '我', val: userTotalValue }
    ];
    
    // 按资产降序排序
    friends.sort((a, b) => b.val - a.val);
    
    const rankList = document.getElementById('rank-list');
    rankList.innerHTML = '';
    
    friends.forEach((f, index) => {
        let isMe = f.name === '我';
        let style = isMe ? 'color: #3b82f6; font-weight: bold;' : '';
        rankList.innerHTML += `
            <li style="${style}">
                <div>
                    <span class="rank-num">${index + 1}</span>
                    <span>${f.name}</span>
                </div>
                <span>¥${f.val.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </li>
        `;
    });
}

// 启动
window.onload = init;
