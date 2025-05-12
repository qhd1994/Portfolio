

// 사이드바
document.getElementById('sidebar_toggle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('expand'))
        {
        sidebar.classList.remove('expand');
        sidebar.classList.add('collapse');
    }
    else
    {
        sidebar.classList.remove('collapse');
        sidebar.classList.add('expand');
    }
});

