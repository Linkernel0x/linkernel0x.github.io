document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const alias = encodeURIComponent(document.getElementById('alias').value);
    const subject_input = encodeURIComponent(document.getElementById('subject').value);
    const bodyText = encodeURIComponent(document.getElementById('bodyText').value);

    const targetEmail = "240083544+Linkernel0x@users.noreply.github.com";
    const subject = `Message from ${alias}: ${subject_input}`;
    const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${bodyText}`;

    window.location.href = mailtoUrl;
});