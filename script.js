document.addEventListener('DOMContentLoaded', () => {
    const btnRisk = document.getElementById('btn-risk');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');

    // 打开弹窗
    btnRisk.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // 禁止滚动
    });

    // 关闭弹窗
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    closeBtn.addEventListener('click', closeModal);

    // 点击外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // 增加按键 Esc 关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});
