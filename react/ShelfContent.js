import PropTypes from 'prop-types'
import { path } from 'ramda'
import React, { Component } from 'react'
import Slider from 'vtex.store-components/Slider'

import ScrollTypes from './ScrollTypes'
import ShelfItem from './ShelfItem'

const DEFAULT_SHELF_ITEM_WIDTH = 281
const DOTS_LARGE_VIEWPORT = true
const SLIDES_TO_SCROLL_LARGE_VIEWPORT = 1

const BREAKPOINT_MOBILE_VIEWPORT = 600
const SLIDER_CENTER_MOBILE_MODE = true
const ARROWS_MOBILE_VIEWPORT = false
const DOTS_MOBILE_VIEWPORT = false
const DEFAULT_ITEMS_MOBILE = 1
const DEFAULT_ITEMS_DESKTOP = 3
const SLIDES_TO_SCROLL_MOBILE_VIEWPORT = 1
const SLIDES_TO_SHOW_MOBILE_VIEWPORT = 1

const VARIABLE_WIDTH_MOBILE_MODE = true

const BREAKPOINT_EXTRA_SMALL_MOBILE_VIEWPORT = 350
const DOTS_EXTRA_SMALL_MOBILE_VIEWPORT = true
const SLIDER_CENTER_MODE_EXTRA_SMALL_MOBILE = true

/**
 * ShelfContent Component. Executes the interaction with react-slick
 * and render the properly content of the Shelf depending of edit mode state.
 */
class ShelfContent extends Component {
  getSliderSettings = itemsPerPage => {
    const { arrows } = this.props
    return {
      slidesToShow: itemsPerPage,
      slidesToScroll: SLIDES_TO_SCROLL_LARGE_VIEWPORT,
      dots: DOTS_LARGE_VIEWPORT,
      arrows,
      responsive: [
        {
          breakpoint: BREAKPOINT_MOBILE_VIEWPORT,
          settings: {
            slidesToShow: SLIDES_TO_SHOW_MOBILE_VIEWPORT,
            slidesToScroll: SLIDES_TO_SCROLL_MOBILE_VIEWPORT,
            arrows: ARROWS_MOBILE_VIEWPORT,
            dots: DOTS_MOBILE_VIEWPORT,
            centerMode: SLIDER_CENTER_MOBILE_MODE,
            variableWidth: VARIABLE_WIDTH_MOBILE_MODE,
          },
        },
        {
          breakpoint: BREAKPOINT_EXTRA_SMALL_MOBILE_VIEWPORT,
          settings: {
            slidesToShow: SLIDES_TO_SHOW_MOBILE_VIEWPORT,
            slidesToScroll: SLIDES_TO_SCROLL_MOBILE_VIEWPORT,
            arrows: ARROWS_MOBILE_VIEWPORT,
            dots: DOTS_EXTRA_SMALL_MOBILE_VIEWPORT,
            centerMode: SLIDER_CENTER_MODE_EXTRA_SMALL_MOBILE,
            variableWidth: VARIABLE_WIDTH_MOBILE_MODE,
          },
        },
      ],
    }
  }

  getClassByItemsPerPage(itemsPerPage) {
    switch (itemsPerPage) {
      case 5:
        return 'w-20'
      case 4:
        return 'w-25'
      case 3:
        return 'w-third'
    }
  }

  getItemsToShow = () => {
    const { itemsPerPage, width, gap } = this.props
    console.log(width)
    let sliderWidth = (DEFAULT_SHELF_ITEM_WIDTH + gap) * itemsPerPage
    let maxItemsPerPage = itemsPerPage
    while (sliderWidth >= width) {
      console.log(sliderWidth, width, maxItemsPerPage)
      --maxItemsPerPage
      sliderWidth = (DEFAULT_SHELF_ITEM_WIDTH + gap) * maxItemsPerPage
    }

    return { sliderWidth, maxItemsPerPage }
  }

  slideFallback = (item = {}, key) => {
    const { summary, gap } = this.props
    const style = {
      width: DEFAULT_SHELF_ITEM_WIDTH,
      marginRight: gap/2,
      marginLeft: gap/2,
    }
    return (
      <div key={key} className="vtex-shelf__slide">
        <div style={style}>
          <ShelfItem item={item} summary={summary} />
        </div>
      </div>
    )
  }

  ssrFallback() {
    const { products, isMobile } = this.props
    const numberOfItems = isMobile ? DEFAULT_ITEMS_MOBILE : DEFAULT_ITEMS_DESKTOP
    const className = this.getClassByItemsPerPage(numberOfItems)
    return (
      <div className="flex justify-center">
        {products &&
          products.slice(0, numberOfItems).map((item, index) => {
            return (
              <div
                key={item.productId}
                className={`${className} flex justify-center`}>
                {this.slideFallback(item, path(['productId'], item) || index)}
              </div>
            )
          })}
      </div>
    )
  }

  render() {
    const { products, maxItems, scroll, gap, isMobile, width } = this.props
    const sliderProps = this.getItemsToShow()
    const isScrollByPage = scroll === ScrollTypes.BY_PAGE.value
    const sliderSettings = this.getSliderSettings(sliderProps.maxItemsPerPage)
    const sliderWidth = (isMobile || width <= BREAKPOINT_MOBILE_VIEWPORT) ? '100%' : sliderProps.sliderWidth
    const styles = {
      width: sliderWidth,
    }
    const productList =
      !products || !products.length ? Array(maxItems).fill(null) : products
    return (
      <div className="vtex-shelf__content flex justify-center">
        <div style={styles}>
          <Slider
            ssrFallback={this.ssrFallback()}
            sliderSettings={sliderSettings}
            scrollByPage={isScrollByPage}
            defaultItemWidth={(DEFAULT_SHELF_ITEM_WIDTH + gap)}>
            {productList
              .slice(0, maxItems)
              .map((item, index) =>
                this.slideFallback(item, path(['productId'], item) || index)
              )}
          </Slider>
        </div>

      </div>
    )
  }
}

ShelfContent.defaultProps = {
  gap: 16,
}

ShelfContent.propTypes = {
  products: PropTypes.arrayOf(ShelfItem.propTypes.item),
  itemsPerPage: PropTypes.number.isRequired,
  maxItems: PropTypes.number.isRequired,
  arrows: PropTypes.bool.isRequired,
  scroll: PropTypes.string.isRequired,
  summary: PropTypes.any,
  isMobile: PropTypes.bool,
  gap: PropTypes.number,
}

export default ShelfContent
