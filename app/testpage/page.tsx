"use client"
import { useState } from "react"

const TabSwitchButton = () => {
  const [tab, setTab] = useState(null)
  const [isTabOpen, setIsTabOpen] = useState(false)

  const handleTabSwitch = () => {
    if (!isTabOpen) {
      // Open a new tab
      const newTab: any = window.open("/new-tab", "_blank")
      setTab(newTab)
      setIsTabOpen(true)

      // Close the tab after 1 second
      setTimeout(() => {
        if (newTab) {
          newTab.close()
          setTab(null)
          setIsTabOpen(false)
        }
      }, 1000) // 1000ms = 1 second
    }
  }

  return (
    <div>
      <button onClick={handleTabSwitch}>
        {isTabOpen ? "Closing Tab..." : "Switch to New Tab"}
      </button>
    </div>
  )
}

export default TabSwitchButton
