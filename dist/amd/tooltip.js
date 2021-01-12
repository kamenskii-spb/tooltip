/*
 * tooltip
 * Version 3.0.0
 * https://tooltipsjs.web.app/
 */

define(function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  class Tooltip {
    constructor(node, options = {}) {
      _defineProperty(this, "$element", null);

      _defineProperty(this, "$tooltip", null);

      _defineProperty(this, "content", "");

      _defineProperty(this, "eventMove", null);

      _defineProperty(this, "options", {});

      _defineProperty(this, "tooltipOpen", false);

      if (typeof node === "string") {
        this.$element = document.querySelector(node);
      } else if (typeof node === "object") {
        this.$element = node;
      } else {
        throw new Error("Tooltip node incorrect typeof ");
      }

      this.options.margin = options.margin || 15;
      this.options.position = options.position || "left";
      this.options.arrowPosition = options.arrowPosition || false;
      this.options.cross = options.cross || false;
      this.options.tooltipMove = options.tooltipMove || false;
      this.options.arrow = options.arrow || false;
      this.options.class = options.class || "";
      if (!this.$element) return;

      if (this.options.tooltipMove) {
        this.eventMove = e => {
          if (!this.$tooltip) return;
          const boundingElement = this.$element.getBoundingClientRect();

          let x = e.pageX + _getOffsetX(this.options, this.$tooltip),
              y = e.pageY + _getOffsetY(this.options, this.$tooltip);

          if (['left', 'right'].includes(this.options.position)) {
            this.$tooltip.style.top = boundingElement.top + window.pageYOffset - this.$tooltip.offsetHeight / 2 + y - this.$element.offsetTop + "px";
          } else if (['top', 'bottom'].includes(this.options.position)) {
            this.$tooltip.style.left = boundingElement.left + (boundingElement.left - x) * -1 - this.$tooltip.offsetWidth / 2 + "px";
          }
        };

        this.$element.addEventListener("mousemove", this.eventMove);
      }

      this.resizeHandler = () => {
        if (this.tooltipOpen) {
          this.close();
        }
      };

      window.addEventListener("resize", this.resizeHandler, false);
    }

    open(contentHTML = "") {
      if (document.readyState === "complete" && !this.tooltipOpen) {
        this.tooltipOpen = true;
        this.$tooltip = _addTooltip(this.$element, this.options, contentHTML);
        this.$tooltip.classList.add("km-tooltip-open");

        if (this.options.cross) {
          this.$tooltip.addEventListener("click", e => {
            if (e.target.dataset.cross) this.close();
          });
        }
      }
    }

    close() {
      if (this.tooltipOpen) {
        this.$tooltip.remove();
        this.tooltipOpen = false;
      }
    }

    destroy() {
      this.close();

      if (this.eventMove) {
        this.$element.removeEventListener("mousemove", this.eventMove);
      }

      window.removeEventListener("resize", this.resizeHandler);
    }

  }

  function _addTooltipPosition($el, $tooltip, options) {
    const boundingElement = $el.getBoundingClientRect();
    let tooltipLeft = boundingElement.left + $el.offsetWidth / 2 - $tooltip.offsetWidth / 2;

    const offsetX = _getOffsetX(options, $tooltip);

    const offsetY = _getOffsetY(options, $tooltip);

    const tooltipPositionX = tooltipLeft + offsetX + 'px';

    switch (options.position) {
      case "top":
        $tooltip.style.top = _getCenterTopPosition($el, $tooltip, options) + 'px';
        $tooltip.style.left = tooltipPositionX;
        break;

      case "bottom":
        $tooltip.style.top = _getCenterBottomPosition($el, options) + 'px';
        $tooltip.style.left = tooltipPositionX;
        break;

      case "left":
        $tooltip.style.top = _getCenterLeftPosition($el, $tooltip) + offsetY + 'px';
        $tooltip.style.left = boundingElement.left - $tooltip.offsetWidth - options.margin + "px";
        break;

      case "right":
        $tooltip.style.top = _getCenterRightPosition($el, $tooltip) + offsetY + 'px';
        $tooltip.style.left = boundingElement.left + $el.offsetWidth + options.margin + "px";
        break;
    }
  }

  function _addTooltip($el, options, html) {
    const $tooltip = _createTooltip($el, options, html);

    document.body.appendChild($tooltip);

    _addTooltipPosition($el, $tooltip, options);

    return $tooltip;
  }

  function _createTooltip($el, options, html) {
    const $tooltip = document.createElement("div");
    if (options.class) $tooltip.classList.add(options.class);
    $tooltip.classList.add("km-tooltip");
    const btnClose = options.cross ? `
              <span
              class="km-times"
              data-cross=true
              >&times;</span>
          ` : "";
    $tooltip.innerHTML = btnClose + html;

    if (options.arrow) {
      $tooltip.insertAdjacentElement("afterbegin", _createArrow(options));
    }

    return $tooltip;
  }

  function _createArrow(options) {
    const $arrow = document.createElement("div");
    $arrow.classList.add("km-tooltip-arrow", `km-tooltip-arrow-${options.position}`);

    if (_is_setArrowPositionX(options)) {
      $arrow.classList.add(`km-tooltip-arrow-position-${options.arrowPosition}`);
    }

    if (_is_setArrowPositionY(options)) {
      $arrow.classList.add(`km-tooltip-arrow-position-${options.arrowPosition}`);
    }

    return $arrow;
  }

  function _getCenterBottomPosition($el, options) {
    return $el.getBoundingClientRect().bottom + window.pageYOffset + options.margin;
  }

  function _getCenterRightPosition($el, $tooltip) {
    return window.pageYOffset + $el.getBoundingClientRect().top + $el.offsetHeight / 2 - $tooltip.offsetHeight / 2;
  }

  function _getCenterLeftPosition($el, $tooltip) {
    return window.pageYOffset + $el.getBoundingClientRect().top + $el.offsetHeight / 2 - $tooltip.offsetHeight / 2;
  }

  function _getCenterTopPosition($el, $tooltip, options) {
    return $el.getBoundingClientRect().top + window.pageYOffset - $tooltip.offsetHeight - options.margin;
  }

  function _getOffsetX(options, $tooltip) {
    let moveLeft = 0;

    if (_is_setArrowPositionX(options)) {
      const moveX = $tooltip.offsetWidth * 30 / 100;
      options.arrowPosition === 'left' ? moveLeft += moveX : moveLeft -= moveX;
    }

    return moveLeft;
  }

  function _getOffsetY(options, $tooltip) {
    let moveTop = 0;

    if (_is_setArrowPositionY(options)) {
      const moveY = $tooltip.offsetHeight * 30 / 100;
      options.arrowPosition === 'top' ? moveTop += moveY : moveTop -= moveY;
    }

    return moveTop;
  }

  function _is_setArrowPositionX(options) {
    return ["left", "right"].includes(options.arrowPosition) && ["top", "bottom"].includes(options.position);
  }

  function _is_setArrowPositionY(options) {
    return ["top", "bottom"].includes(options.arrowPosition) && ["left", "right"].includes(options.position);
  }

  return Tooltip;

});
