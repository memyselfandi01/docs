import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import useMeasure from 'react-use-measure'
import { ResizeObserver } from '@juggle/resize-observer'
import cn from 'classnames'

import Icon from '../icons/chevron-down'
import Text from '../text'
import { useCollapse } from './collapse-context'
import useMediaQuery from '~/lib/use-media-query'

const Collapse = ({ title, subtitle, id, onToggle, card, children }) => {
  const [ref, { height }] = useMeasure({ polyfill: ResizeObserver })
  const [active, setActive] = useState(false)
  const collapseContext = useCollapse()
  const immediateAnimation = useRef(false)

  // Trigger re-render when window size changes
  useMediaQuery(960)
  useMediaQuery(600)

  const toggle = useCallback(() => setActive(!active), [active])

  const open = useMemo(() => {
    return collapseContext
      ? !collapseContext.selected
        ? active
        : collapseContext.selected === title
      : active
  }, [collapseContext, active, title])

  const _toggle = useMemo(() => {
    return collapseContext
      ? () => {
          collapseContext.onChange(open ? null : title)
          if (typeof onToggle === 'function') onToggle()
        }
      : toggle
  }, [collapseContext, open, title, onToggle, toggle])

  const onKeyPress = useCallback((e, cb) => {
    if (e.key === ' ' || e.key === 'Enter') {
      cb()
      e.preventDefault()
    }
  }, [])

  const props = useSpring({
    height: open ? height : 0,
    immediate: immediateAnimation.current,
    config: { tension: 250, friction: 32, clamp: true }
  })

  useEffect(() => {
    let timeout
    const hash = location.hash.slice(1)
    if (id === hash) {
      immediateAnimation.current = true
      if (collapseContext) {
        collapseContext.onChange(title)
      } else {
        setActive(true)
      }
      timeout = setTimeout(() => {
        immediateAnimation.current = false
      }, 1000)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [])

  return (
    <div className={cn('collapse', { card })} id={id}>
      <div
        role="button"
        tabIndex="0"
        className="collapse-title"
        aria-expanded={open}
        onClick={_toggle}
        onKeyPress={ev => onKeyPress(ev, _toggle)}
      >
        <div className="top">
          <Text h3 weight={600} noMargin>
            {title}
          </Text>
          <span className={cn('icon', { open })}>
            <Icon />
          </span>
        </div>

        {subtitle && (
          <Text className="subtitle" type="secondary" noMargin>
            {subtitle}
          </Text>
        )}
      </div>

      <animated.div
        style={{
          overflow: 'hidden',
          ...props
        }}
      >
        <div ref={ref} className={cn('collapse-content', { open })}>
          {children}
        </div>
      </animated.div>

      <style jsx>{`
        .collapse {
          text-align: left;
          border-top: ${collapseContext
            ? 'none'
            : '1px solid var(--accents-2)'};
          border-bottom: 1px solid var(--accents-2);
          padding: var(--geist-gap) 0;
        }

        .collapse.card {
          padding: var(--geist-gap);
          box-shadow: var(--shadow-small);
          border-radius: var(--geist-radius);
          border: none;
        }

        .collapse-title {
          text-transform: none;
          color: var(--geist-foreground);
          cursor: pointer;
          outline-width: 0;
        }

        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .subtitle {
          color: var(--geist-secondary);
          margin-top: var(--geist-gap);
        }

        .collapse-content {
          font-size: 16px;
          line-height: 26px;
          overflow-y: hidden;
        }

        .collapse-content > div {
          overflow-y: hidden;
        }

        /* Support box shadow on child elements */
        .collapse-content.open,
        .collapse-content.open > div {
          margin-left: -60px;
          margin-right: -60px;
          padding-left: 60px;
          padding-right: 60px;
        }

        .icon {
          transition: transform 0.2s ease;
        }

        .icon.open {
          transform: rotate(-180deg);
        }
      `}</style>
    </div>
  )
}

export default Collapse
