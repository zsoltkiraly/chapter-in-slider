/*
Chapter in slider - Code by Zsolt Király
v1.2.9 - 2018-03-31
*/

function getInternetExplorerVersion() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
};

var chapterInSlider = function() {

    var forEach = function(array, callback, scope) {

        var i = 0,
            len = array.length;
        if (len > 0) {
            for (; i < len; i++) {
                callback.call(scope, i, array[i]);
            }
        }
    }

    function getElemDistance(element) {
        var location = 0;
        if (element.offsetParent) {
            do {
                location += element.offsetTop;
                element = element.offsetParent;
            } while (element);
        }
        return location >= 0 ? location : 0;
    }

    function scrolling(element, duration) {

        var startingY = window.pageYOffset;
        var targetY = document.body.scrollHeight - element < window.innerHeight ? document.body.scrollHeight - window.innerHeight : element;
        var diff = targetY - startingY;
        var easing = function(t) {
            return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        }

        var start;
        if (!diff) return;


        function animation() {
            window.requestAnimationFrame(function step(timestamp) {
                if (!start) {
                    start = timestamp;
                }

                var time = timestamp - start;
                var percent = Math.min(time / duration, 1);

                percent = easing(percent);

                window.scrollTo(0, startingY + diff * percent);

                if (time < duration) {
                    window.requestAnimationFrame(step);
                }
            });
        };

        if (getInternetExplorerVersion() > -1) {
            if (getInternetExplorerVersion() > 9.0) {
                animation();
            } else {
                window.scrollTo(0, startingY + diff);
            }
        } else {
            animation();
        }
    };

    function sliderMinhight(cIS) {

        var dotsHeight = cIS.querySelector('.chapter-dots').offsetHeight,
            chapterContent = cIS.querySelector('.chapter-content');

        var padding = 40,
            arrowHeight = 35;

        var setheight = padding + arrowHeight + dotsHeight;

        chapterContent.style.minHeight = setheight + 'px';
    }

    function topSlider(cIS) {

        var topChapterContent = getElemDistance(cIS);
        scrolling(topChapterContent, 1000);
    }

    function setId(dots, chapters) {

        forEach(dots, function(index, dot) {
            dot.setAttribute('data-dots-id', index + 1);
        });

        forEach(chapters, function(index, chapter) {
            chapter.setAttribute('data-chapters-id', index + 1);
        });
    }

    function disabled(disParam) {

        disParam.classList.add('disabled-click');

        setTimeout(function() {
            disParam.classList.remove('disabled-click');
        }, 500);
    }

    function chapterSelector(cIS, dots, chapters, navigationPrev, navigationNext) {

        forEach(dots, function(index, dot) {

            var chapterDots = cIS.querySelector('.chapter-dots');

            if (dots.length > 1) {
                dot.addEventListener('click', function() {

                    var obj = this,
                        objDotId = obj.getAttribute('data-dots-id');

                    disabled(cIS);

                    if (getInternetExplorerVersion() > -1) {
                        if (getInternetExplorerVersion() > 9.0) {
                            if (window.matchMedia("(min-width: 998px)").matches) {
                                topSlider(cIS);
                            }
                        }
                    } else {
                        if (window.matchMedia("(min-width: 998px)").matches) {
                            topSlider(cIS);
                        }
                    }

                    forEach(dots, function(index, dot) {

                        if (obj == dot) {
                            dot.classList.add('active');

                        } else {
                            dot.classList.remove('active');
                        }

                        var dotsId = dot.getAttribute('data-dots-id'),
                            objId = obj.getAttribute('data-dots-id');

                        if (objId > dotsId) {

                            forEach(chapters, function(index, chapter) {

                                var chapterId = chapter.getAttribute('data-chapters-id');

                                if (chapterId == dotsId) {

                                    var innerLine = parseFloat(chapter.querySelector('.inner-line').style.width, 10),
                                        contentList = chapter.querySelector('ul.content-list'),
                                        contentElementWidth = parseFloat(contentList.querySelectorAll('li.content-element')[0].style.width, 10);

                                    contentList.style.marginLeft = '-' + (innerLine - contentElementWidth) + 'px';

                                    var elements = chapter.querySelectorAll('ul.content-list li.content-element'),
                                        lastElement = elements[elements.length - 1];

                                    forEach(elements, function(index, element) {
                                        element.classList.remove('active');
                                        lastElement.classList.add('active');
                                    });
                                }
                            });

                        } else {
                            forEach(chapters, function(index, chapter) {
                                var chapterId = chapter.getAttribute('data-chapters-id');

                                if (chapterId == dotsId) {
                                    var contentList = chapter.querySelector('ul.content-list'),
                                        contentElements = chapter.querySelectorAll('ul.content-list li.content-element');

                                    contentList.style.marginLeft = 0 + 'px';

                                    forEach(contentElements, function(index, contentElement) {
                                        contentElement.classList.remove('active');
                                        contentElements[0].classList.add('active');
                                    });
                                }
                            });
                        }
                    });

                    forEach(chapters, function(index, chapter) {

                        if (objDotId == chapter.getAttribute('data-chapters-id')) {

                            setTimeout(function() {
                                chapter.classList.add('active');
                            }, 50);

                            chapter.classList.remove('fade');

                            var contentList = chapter.querySelector('ul.content-list').style.marginLeft = 0 + 'px',
                                contentElements = chapter.querySelectorAll('ul.content-list li.content-element'),
                                firstElement = chapter.querySelectorAll('ul.content-list li.content-element')[0];

                            forEach(contentElements, function(index, contentElement) {
                                contentElement.classList.remove('active');
                                firstElement.classList.add('active');
                            });

                            var firstDot = dots[0];
                            var lastDot = dots[dots.length - 1];

                            if (obj != firstDot || obj || lastDot) {
                                navigationPrev.classList.remove('in-active');
                                navigationNext.classList.remove('in-active');
                            }

                            if (obj == firstDot) {

                                var marginLeft = parseFloat(chapters[0].querySelector('.slided-content .content-box .inner-line ul.content-list').style.marginLeft, 10);

                                if (marginLeft == 0) {
                                    navigationPrev.classList.add('in-active');
                                    navigationNext.classList.remove('in-active');

                                } else {
                                    navigationPrev.classList.remove('in-active');
                                    navigationNext.classList.remove('in-active');
                                }
                            }

                            if (obj == lastDot) {
                                var lastChapter = chapters[chapters.length - 1],
                                    elementLength = lastChapter.querySelectorAll('ul.content-list li.content-element').length,
                                    elementWidth = parseFloat(lastChapter.querySelectorAll('ul.content-list li.content-element')[0].style.width, 10),
                                    marginLeft = (parseFloat(lastChapter.querySelector('ul.content-list').style.marginLeft, 10) * -1);

                                if ((elementWidth * elementLength - elementWidth) == marginLeft) {
                                    navigationPrev.classList.remove('in-active');
                                    navigationNext.classList.add('in-active');

                                } else {
                                    navigationPrev.classList.remove('in-active');
                                    navigationNext.classList.remove('in-active');
                                }
                            }
                        } else {
                            chapter.classList.add('fade');
                            chapter.classList.remove('active');
                        }
                    });
                }, false);

                chapterDots.style.display = '';

            } else {
                chapterDots.style.display = 'none';
            }
        });
    }

    function sliderWidth(cB, iL, cL, cE) {
        var sliderLiWidth = cB.offsetWidth;

        forEach(cE, function(index, element) {
            element.style.width = sliderLiWidth + 'px';
        });
    }

    function marginLeftSetWidth(chapters) {
        forEach(chapters, function(index, chapter) {

            var iL = chapter.querySelector('.slided-content .content-box .inner-line'),
                cL = chapter.querySelector('.slided-content .content-box .inner-line ul.content-list'),
                lI = chapter.querySelector('.slided-content .content-box .inner-line ul.content-list li.active');

            var sliderLiDataId = lI.getAttribute('data-id'),
                sliderLiWidth = parseFloat(lI.style.width, 10);
            cL.style.marginLeft = '-' + (sliderLiWidth * (sliderLiDataId - 1)) + 'px';
        });
    }

    function parameters(c) {
        var param = {};

        var activeElemnent = c.querySelector('.chapter.active');

        param.cB = activeElemnent.querySelector('.content-box');
        param.iL = param.cB.querySelector('.inner-line');
        param.cL = param.cB.querySelector('ul.content-list');
        param.cE = param.cL.querySelectorAll('li.content-element');

        return param;
    }

    function setChapter(chapters, cIS) {
        function activeChapter(chapters, cIS) {

            var innerLine = parameters(cIS).iL;
            var contentList = parameters(cIS).cL;
            var contentElement = parameters(cIS).cE;
            var contentBox = parameters(cIS).cB;

            sliderWidth(contentBox, innerLine, contentList, contentElement);

            setTimeout(function() {
                marginLeftSetWidth(chapters);
            }, 50);
        };

        activeChapter(chapters, cIS);

        window.addEventListener('resize', function() {
            activeChapter(chapters, cIS);
        }, false);
    }

    function activeClone(chapters, cIS) {
        function setWidth(chapters, cIS) {

            var activeElemnent = cIS.querySelector('.chapter.active');
            var activeElement = parseFloat(activeElemnent.querySelectorAll('.inner-line ul.content-list li.content-element')[0].style.width, 10);

            forEach(chapters, function(index, chapter) {

                var allElements = chapter.querySelectorAll('.inner-line ul li');

                forEach(allElements, function(index, allElement) {
                    allElement.style.width = activeElement + 'px';
                    allElement.setAttribute('data-id', index + 1);

                    chapter.setAttribute('data-content', allElements.length);

                    var pieceWidth = parseFloat(allElements[0].style.width, 10);

                    chapter.querySelector('.inner-line').style.width = (pieceWidth * allElements.length) + 'px';
                });
            });
        }

        setWidth(chapters, cIS);

        window.addEventListener('resize', function() {
            setWidth(chapters, cIS);
        }, false);
    }


    function navigation(cIS, navigationPrev, navigationNext) {
        var chapters = cIS.querySelectorAll('.chapter'),
            chaptersLength = chapters.length;

        forEach(chapters, function(index, chapter) {

            var liElements = chapter.querySelectorAll('ul.content-list li.content-element'),
                liElementsLength = liElements.length;

            if (chaptersLength == 1 && liElementsLength == 1) {
                navigationPrev.classList.add('in-active');
                navigationNext.classList.add('in-active');
            }

        });

        function nextSlide(cIS, iL, cL, cE) {

            var sliderLiWidth = parseFloat(cE[0].style.width, 10),
                sliderUlGet = (parseFloat(cL.style.marginLeft, 10) * -1),
                sliderInnerLine = parseFloat(iL.style.width, 10);

            if (sliderUlGet <= (sliderInnerLine - sliderLiWidth * 2)) {

                cL.style.transition = 'all ' + 500 + 'ms';
                cL.style.marginLeft = '-' + (sliderUlGet + sliderLiWidth) + 'px';

                disabled(cIS);

                setTimeout(function() {
                    cL.style.transition = '';
                }, 500);

                function setActive(list) {
                    list.classList.remove('active');
                    list.nextElementSibling.classList.add('active');
                }

                var activeElement = cIS.querySelector('.chapter.active li.content-element.active');

                setTimeout(function() {
                    setActive(activeElement);
                }, 50);
            }


            if (sliderUlGet == (sliderLiWidth * cE.length - (sliderLiWidth))) {

                var chapterActive = cIS.querySelector('.chapter.active');

                if (chapterActive) {
                    var nextChapter = chapterActive.nextElementSibling;

                    if (nextChapter && nextChapter != navigationPrev) {

                        setTimeout(function() {
                            nextChapter.classList.add('active');
                        }, 50);

                        nextChapter.classList.remove('fade');

                        chapterActive.classList.add('fade');
                        chapterActive.classList.remove('active');

                        var activeDots = cIS.querySelector('.chapter-dots ul li.active');

                        var nextDots = activeDots.nextElementSibling;

                        if (nextDots) {
                            activeDots.classList.remove('active');
                            nextDots.classList.add('active');
                        }
                    }
                }
            }


            var chapters = cIS.querySelectorAll('.chapter'),
                chaptersLength = chapters.length,
                lastChapter = chapters[chapters.length - 1],
                allLiElements = cIS.querySelectorAll('ul.content-list li.content-element'),
                allLiElementsLen = allLiElements.length;

            forEach(chapters, function(index, chapter) {

                var liElements = chapter.querySelectorAll('ul.content-list li.content-element'),
                    liElementsLength = liElements.length;

                if (chaptersLength == 1 && liElementsLength > 1) {
                    navigationPrev.classList.remove('in-active');

                    var lastElement = liElements[liElements.length - 1];

                    setTimeout(function() {
                        if (lastElement.classList.contains('active')) {
                            navigationNext.classList.add('in-active');
                        }
                    }, 50);
                }
            });

            if (chaptersLength > 1 && allLiElementsLen > 1) {

                navigationPrev.classList.remove('in-active');

                var allLastElement = allLiElements[allLiElements.length - 1];
                var allLastElementPrev = allLastElement.previousElementSibling;

                if (allLastElementPrev != null || allLastElementPrev != undefined) {

                    setTimeout(function() {
                        if (allLastElement.classList.contains('active')) {
                            navigationNext.classList.add('in-active');
                        }
                    }, 50);

                } else {

                    var lastChapterLi = lastChapter.querySelectorAll('ul.content-list li.content-element'),
                        lastChapterLiLast = lastChapterLi[lastChapterLi.length - 1],
                        lastChapterLen = lastChapterLi.length;

                    if (lastChapterLen == 1) {
                        setTimeout(function() {
                            if (lastChapter.classList.contains('active')) {
                                navigationNext.classList.add('in-active');
                            }
                        }, 50);

                    } else {
                        setTimeout(function() {
                            if (lastChapterLiLast.classList.contains('active')) {
                                navigationPrev.classList.add('in-active');
                            }
                        }, 50);
                    }
                }
            }
        }

        function prevSlide(cIS, iL, cL, cE) {
            var sliderLiWidth = parseFloat(cE[0].style.width, 10),
                sliderUlGet = (parseFloat(cL.style.marginLeft, 10) * -1),
                sliderInnerLine = parseFloat(iL.style.width, 10);

            if (sliderUlGet > 0) {

                cL.style.transition = 'all ' + 500 + 'ms';
                cL.style.marginLeft = '-' + (sliderUlGet - sliderLiWidth) + 'px';

                disabled(cIS);

                setTimeout(function() {
                    cL.style.transition = '';
                }, 500);

                function setActive(list) {
                    list.classList.remove('active');
                    list.previousElementSibling.classList.add('active');
                };

                var activeElement = cIS.querySelector('.chapter.active li.content-element.active');

                setTimeout(function() {
                    setActive(activeElement);
                }, 50);
            }

            if (sliderUlGet == 0) {
                var chapterActive = cIS.querySelector('.chapter.active');

                if (chapterActive) {
                    var prevChapter = chapterActive.previousElementSibling;

                    if (prevChapter) {

                        setTimeout(function() {
                            prevChapter.classList.add('active');
                        }, 50);

                        prevChapter.classList.remove('fade');

                        chapterActive.classList.add('fade');
                        chapterActive.classList.remove('active');

                        var activeDots = cIS.querySelector('.chapter-dots ul li.active');

                        var nextDots = activeDots.previousElementSibling;

                        if (nextDots) {
                            activeDots.classList.remove('active');
                            nextDots.classList.add('active');
                        }

                        navigationPrev.classList.remove('in-active');
                    }
                }
            }

            var chapters = cIS.querySelectorAll('.chapter'),
                chaptersLength = chapters.length,
                firstChapter = chapters[0],
                allLiElements = cIS.querySelectorAll('ul.content-list li.content-element'),
                allLiElementsLen = allLiElements.length;

            forEach(chapters, function(index, chapter) {

                var liElements = chapter.querySelectorAll('ul.content-list li.content-element'),
                    liElementsLength = liElements.length;

                if (chaptersLength == 1 && liElementsLength > 1) {
                    navigationNext.classList.remove('in-active');

                    var firstElement = liElements[0];

                    setTimeout(function() {
                        if (firstElement.classList.contains('active')) {
                            navigationPrev.classList.add('in-active');
                        }
                    }, 50);
                }

            });

            if (chaptersLength > 1 && allLiElementsLen > 1) {

                navigationNext.classList.remove('in-active');

                var allFirstElement = allLiElements[0];
                var allFirstElementPrev = allFirstElement.previousElementSibling;

                if (allFirstElementPrev != null || allFirstElementPrev != undefined) {

                    setTimeout(function() {
                        if (allFirstElement.classList.contains('active')) {
                            navigationPrev.classList.add('in-active');
                        }
                    }, 50);

                } else {

                    var firstChapterLi = firstChapter.querySelectorAll('ul.content-list li.content-element'),
                        firstChapterLiFirst = firstChapterLi[0],
                        firstChapterLiLen = firstChapterLi.length;

                    if (firstChapterLiLen == 1) {
                        setTimeout(function() {
                            if (firstChapter.classList.contains('active')) {
                                navigationPrev.classList.add('in-active');
                            }
                        }, 50);

                    } else {
                        setTimeout(function() {
                            if (firstChapterLiFirst.classList.contains('active')) {
                                navigationPrev.classList.add('in-active');
                            }
                        }, 50);
                    }
                }
            }
        };

        navigationNext.addEventListener('click', function() {
            var iL = parameters(cIS).iL;
            var cL = parameters(cIS).cL;
            var cE = parameters(cIS).cE;

            nextSlide(cIS, iL, cL, cE);
        }, false);

        navigationPrev.addEventListener('click', function() {
            var iL = parameters(cIS).iL;
            var cL = parameters(cIS).cL;
            var cE = parameters(cIS).cE;

            prevSlide(cIS, iL, cL, cE);
        }, false);


        var startx = 0;
        var dist = 0;

        cIS.addEventListener('touchstart', function(e) {
            var touchobj = e.changedTouches[0];
            startx = parseInt(touchobj.clientX);
        }, false);


        cIS.addEventListener('touchend', function(e) {
            var touchobj = e.changedTouches[0];
            var dist = parseInt(touchobj.clientX) - startx;

            if (dist > 50) {

                var iL = parameters(cIS).iL;
                var cL = parameters(cIS).cL;
                var cE = parameters(cIS).cE;

                prevSlide(cIS, iL, cL, cE);

            } else if (dist < -50) {

                var iL = parameters(cIS).iL;
                var cL = parameters(cIS).cL;
                var cE = parameters(cIS).cE;

                nextSlide(cIS, iL, cL, cE);
            }
        }, false);
    }

    function loading(container) {
        setTimeout(function() {
            container.classList.remove('show');

            setTimeout(function() {
                container.classList.remove('loading');
            }, 500);

        }, 500);
    }

    function app(config) {
        var chapterInSlider = document.querySelector('#' + config.contentBox + '');

        if (chapterInSlider) {
            var chapterDots = chapterInSlider.querySelectorAll('.chapter-dots ul li'),
                chapterContents = chapterInSlider.querySelectorAll('.chapter-content .chapter');

            var prev = chapterInSlider.querySelector('.navigation-prev'),
                next = chapterInSlider.querySelector('.navigation-next');

            setId(chapterDots, chapterContents);
            chapterSelector(chapterInSlider, chapterDots, chapterContents, prev, next);
            setChapter(chapterContents, chapterInSlider);
            activeClone(chapterContents, chapterInSlider);
            navigation(chapterInSlider, prev, next);
            sliderMinhight(chapterInSlider);
            loading(chapterInSlider);
        }
    }

    return {
        app: app
    }

}();