var isDisplayed = false;

/**
 * 
 * @param {string?} id Optional ID
 * @returns {HTMLDivElement}
 */
const div = (id) => {
    let createdDiv = document.createElement('div');
    if (id) createdDiv.id = id;
    return createdDiv;
}

/**
 * Fade out, then hide after 1 sec.
 * @param {HTMLElement} element 
 * @returns {number} timeoutId
 */
function fadeOutAndHide(element, secondsToFadeOut, secondsToGone, callback) {
    const timeoutId = setTimeout(() => {

        element.classList.add('sax-hide');
        element.classList.remove('sax-show');

        setTimeout(() => {
            element.classList.add('sax-gone');
            element.classList.remove('sax-hide');
            callback();
        }, secondsToGone * 1000);
    }, secondsToFadeOut * 1000);

    return timeoutId;
}

function showAndFadeIn(element, secondsToUnhidden, secondsToFadeIn, callback) {
    const timeoutId = setTimeout(() => {

        element.classList.remove('sax-gone');

        setTimeout(() => {
            element.classList.add('sax-show');
            callback();
        }, secondsToFadeIn * 1000);
    }, secondsToUnhidden * 1000);

    return timeoutId;
}

/**
 * 
 * @param {{visited: number, stumbleUrl: StumbleURL, isRabbitHoleEnabled: boolean}} request 
 */
function showStumbleInfo(request) {

    var enterTimeoutId = null;
    var exitTimeoutId = null;

    // UI
    var ui = document.createElement("div");
    ui.id = 'sax-info-box';

    // Horizontal top bubbles container
    var topBubbles = div('sax-top-bubbles');

    // Rabbit hole bubble
    var rabbitHoleBubble = document.createElement('div');
    rabbitHoleBubble.id = 'sax-rabbit-hole-bubble';
    rabbitHoleBubble.classList.add('sax-hide');
    // Replaced request.stumbleUrl.listTitle with request.stumbleUrl.title
    rabbitHoleBubble.innerHTML = `
        <img id="sax-rabbit-hole-exit-button" src=${chrome.extension.getURL('images/close.svg')} />
        <img id="sax-rabbit-hole-spiral" src=${chrome.extension.getURL('images/spiral.png')} />
        <div id="sax-rabbit-hole-text">
            <p id="sax-rabbit-hole-text-top">In Curiously Mode Category:</p>
            <p id="sax-rabbit-hole-text-bottom">${request.stumbleUrl.category_1}</p>
        </div>
    `;

    // Top bubble
    var stumbleCounterBubble = document.createElement("div");
    stumbleCounterBubble.id = 'sax-info-box-top';

    var stumbleCounterContent = document.createElement('div');
    stumbleCounterContent.id = 'sax-info-box-top-content';

    var text = document.createElement('div');
    text.id = 'sax-label';

    var title = div('sax-info-box-top-title');
    title.innerHTML = `<span id="sax-label-secondary">Curiously No.</span><span id="sax-label-primary">${request.visited}</span>`;
    text.append(title);

    var icon = document.createElement('img');
    icon.src = chrome.extension.getURL('images/icon_32.png')
    icon.id = 'sax-info-box-icon'

    stumbleCounterContent.appendChild(icon);
    stumbleCounterContent.appendChild(text);

    var progress = document.createElement('div');
    progress.className = 'sax-progress';
    var progressOuter = document.createElement('div');
    progressOuter.className = 'sax-progress-outer';

    var progressInner = document.createElement('div');
    progressInner.className = 'sax-progress-inner';
    progressInner.style.width = `${(request.visited / request.totalUrls) * 100}%`;
    progress.append(progressOuter, progressInner);

    ui.classList.add('sax-hide');
    stumbleCounterBubble.appendChild(stumbleCounterContent);
    topBubbles.appendChild(rabbitHoleBubble);
    topBubbles.appendChild(stumbleCounterBubble);
    ui.appendChild(topBubbles);

    // Bottom bubble if title exists
    var bottom = document.createElement('div');
    bottom.id = 'sax-info-box-bottom';
    var content = document.createElement('div');
    content.id = 'sax-info-box-bottom-content';
    /*
        <span id="sax-label-small-primary">
            Main Category: ${request.stumbleUrl.url ? `'${request.stumbleUrl.category_1}'` : `curated`} 
        </span>
        <span id="sax-label-small-secondary">
            <a id="sax-list-url" href=${request.stumbleUrl.url}>
                ${request.stumbleUrl.category_1}
            </a>
        </span>



            <span id="sax-label-small-primary">
            Source: ${request.stumbleUrl.title ? `'${request.stumbleUrl.title}'` : `curated`} from awesome list about 
        </span>
        <span id="sax-label-small-secondary">
            <a id="sax-list-url" href=${request.stumbleUrl.listUrl}>
                ${request.stumbleUrl.listTitle}
            </a>
        </span>
    */

//    content.innerHTML = `

//    <div id="sax-rabbit-hole">
//        <img id="sax-rabbit-hole-image" src=${chrome.extension.getURL('images/rabbithole.png')} />
//    </div>
// `;
    content.innerHTML = `
    <span id="sax-label-small-primary">
        Category: 
    </span>
    <span id="sax-label-small-secondary">
        <a id="sax-list-url" href=${request.stumbleUrl.url}>
            ${request.stumbleUrl.category_1}
        </a>
    </span>
        <div id="sax-rabbit-hole">
            <img id="sax-rabbit-hole-image" src=${chrome.extension.getURL('images/rabbithole.png')} />
        </div>
    `;
    bottom.append(content);

    // Popup
    var newFeaturePopup = div('sax-new-feature-popup');
    newFeaturePopup.innerHTML = `
        <p id='sax-new-feature-popup-badge'>Curious?</p>
        <p id='sax-new-feature-popup-text'>Click on <bold>Focus</bold> to stay on a category</p>
    `;

    ui.appendChild(bottom);
    ui.appendChild(newFeaturePopup);

    enterTimeoutId = setTimeout(() => {
        ui.classList.add('sax-show');
        ui.classList.remove('sax-hide');

        isDisplayed = true;

        exitTimeoutId = fadeOutAndHide(ui, 5, 0.5, () => {
            isDisplayed = false;
        });

    }, 100)


    ui.addEventListener("mouseenter", () => {
        clearTimeout(exitTimeoutId);
    });

    ui.addEventListener("mouseleave", () => {
        if (isDisplayed) {
            // clearTimeout();
            exitTimeoutId = fadeOutAndHide(ui, 5, 0.5, () => {
                isDisplayed = false;
            });
        }
    });

    document.body.prepend(ui);

    if (request.isRabbitHoleEnabled) {
        showRabbitHoleEnabled();
        console.log('REQUEST RABBIT ENABLED =>:', request)
    } else {
        showRabbitHoleDisabled();
    }

    // On hover change to GIF for rabbit hole
    var rabbitHole = document.getElementById('sax-rabbit-hole-image');
    rabbitHole.addEventListener('mouseenter', () => {
        rabbitHole.setAttribute('src', chrome.extension.getURL('images/rabbithole.gif'));
        // Show new feature popup
        showAndFadeIn(newFeaturePopup, 0.1, 0.1, () => {});
    });

    rabbitHole.addEventListener('mouseleave', () => {
        rabbitHole.setAttribute('src', chrome.extension.getURL('images/rabbithole.png'));
        // Hide new feature popup
        if (!request.isRabbitHoleEnabled) {
            fadeOutAndHide(newFeaturePopup, 3, 0.5, () => {});
        }
    });

    rabbitHole.addEventListener('click', () => {
        chrome.storage.local.set({ 'featureRabbitHole1Seen': true }, () => {
            const newFeaturePopup = document.getElementById('sax-new-feature-popup');
            newFeaturePopup.classList.remove('sax-show-fast');
            newFeaturePopup.classList.add('sax-gone');
        });
        chrome.runtime.sendMessage({ message: 'rabbit-hole-enter' })
    });

    var rabbitHoleExitButton = document.getElementById('sax-rabbit-hole-exit-button');

    rabbitHoleExitButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ message: 'rabbit-hole-exit' })
    });

    // Show / Hide the New feature popup depending on flag
    chrome.storage.local.get({ 'featureRabbitHole1Seen': false }, function (result) {
        const newFeaturePopup = document.getElementById('sax-new-feature-popup');

        if (request.isRabbitHoleEnabled || result.featureRabbitHole1Seen) {
            newFeaturePopup.classList.add('sax-hide-fast');
            newFeaturePopup.classList.remove('sax-show-fast');
        } else {
        }
    });
}

function showRabbitHoleEnabled() {

    var rabbitHoleEnabled = document.getElementById('sax-rabbit-hole-bubble');
    rabbitHoleEnabled.classList.add('sax-show');
    rabbitHoleEnabled.classList.remove('sax-hide');

    var rabbitHoleDisabled = document.getElementById('sax-rabbit-hole');
    // rabbitHoleDisabled.classList.add('sax-gone');
    rabbitHoleDisabled.classList.add('sax-rabbithole-no-width');
    rabbitHoleDisabled.classList.remove('sax-rabbithole-full-width');
    // rabbitHoleDisabled.classList.remove('sax-show');
}

function showRabbitHoleDisabled() {
    var rabbitHoleEnabled = document.getElementById('sax-rabbit-hole-bubble');
    rabbitHoleEnabled.classList.add('sax-hide');
    rabbitHoleEnabled.classList.remove('sax-show');

    var rabbitHoleDisabled = document.getElementById('sax-rabbit-hole');
    rabbitHoleDisabled.classList.add('sax-rabbithole-full-width');
    rabbitHoleDisabled.classList.remove('sax-rabbithole-no-width');
}

function toggleStumbleInfo(request) {
    var bubblesInfo = document.getElementById('sax-info-box');
    if (bubblesInfo !== null) {
        if (isDisplayed) {
            bubblesInfo.classList.add('sax-gone');
            bubblesInfo.classList.remove('sax-show');
            isDisplayed = false;
        } else {
            bubblesInfo.classList.add('sax-show');
            bubblesInfo.classList.remove('sax-gone');
            isDisplayed = true;
        }
    } else {
        showStumbleInfo(request);
    }
}

function hideWelcomeInfo() {
    document.body.removeChild(document.getElementById('sax-welcome'))
}

function showWelcomeInfo(request) {
    os = request.os;

    const ui = document.createElement('div');
    ui.id = "sax-welcome";
    icon = document.createElement('img');

    icon.id = 'sax-welcome-icon';
    icon.src = chrome.extension.getURL('images/icon_128.png');

    text = div('sax-welcome-text');
    text.innerHTML = `<p id="sax-welcome-text-title">
    The cat found something curious!
    </p>
    </br>
    <p id="sax-welcome-text-body">
    You will find all sorts of hidden gems on the internet.
    </br>
    Engage your curiousity by clicking on the "C" icon in the toolbar, or press <span id="sax-keyboard-shortcut">${os === 'mac' ? "Alt+Shift+S" : "Alt+Shift+S"}
    </span>
    </br></br>
    <div id="sax-welcome-new-feature">
        <img id="sax-rabbit-hole-spiral-2" src=${chrome.extension.getURL('images/spiral.png')} />
        <span id='sax-welcome-text-body-small-accent'>Did You Know?</span>
        </br>
        <span id='sax-welcome-text-body-small'>
            <span id='sax-welcome-text-body-small-white'>Curiously Mode: </span>You can stay on the same category by pressing the disappearing Curiously image.
        </span>
    </div>
    </br></br>`;

    close = document.createElement('a')
    close.innerHTML = "Got it? Go get curious!"
    close.id = 'sax-welcome-close';

    ui.appendChild(icon);
    ui.appendChild(text);
    ui.appendChild(close);
    close.addEventListener('click', hideWelcomeInfo);
    document.body.prepend(ui);
    chrome.storage.local.set({ 'welcome_seen': true }, function () {
    });
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "stumble") {
            if (isDisplayed) {
                if (request.isRabbitHoleEnabled) {
                    showRabbitHoleEnabled();
                    // console.log('REQUEST RABBIT ONMESSAGE =>:', request.isRabbitHoleEnabled, request.message)
                } else {
                    showRabbitHoleDisabled();
                }
            } else {
                toggleStumbleInfo(request);
            }
        } else if (request.message === "welcome") {
            showWelcomeInfo(request);
        }
    }
);