import { useEffect, useRef, useState } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

export function useWebSocket(token, topic, onMessage) {
  const [isConnected, setIsConnected] = useState(false)
  const clientRef = useRef(null)
  const topicRef = useRef(topic)
  const subscriptionsRef = useRef(new Map()) // Store all active subscriptions
  const messageHandlerRef = useRef(onMessage)

  // Update message handler when it changes
  useEffect(() => {
    messageHandlerRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    if (!token) return

    const socket = new SockJS(process.env.NEXT_PUBLIC_SOCKET_URL)
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: function (str) {
        console.log(str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    client.onConnect = () => {
      setIsConnected(true)
      console.log('Connected to WebSocket')

      // Subscribe to the current topic
      if (topicRef.current) {
        subscribeToTopic(client, topicRef.current)
      }
    }

    client.onDisconnect = () => {
      setIsConnected(false)
      console.log('Disconnected from WebSocket')
      subscriptionsRef.current.clear() // Clear all subscriptions on disconnect
    }

    client.activate()
    clientRef.current = client

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate()
        subscriptionsRef.current.clear()
      }
    }
  }, [token])

  // Handle topic changes
  useEffect(() => {
    if (!clientRef.current || !isConnected) return

    // Subscribe to new topic if not already subscribed
    if (topic && !subscriptionsRef.current.has(topic)) {
      subscribeToTopic(clientRef.current, topic)
    }

    // Update current topic reference
    topicRef.current = topic
  }, [topic, isConnected])

  // Helper function to subscribe to a topic
  const subscribeToTopic = (client, topic) => {
    if (subscriptionsRef.current.has(topic)) return

    const subscription = client.subscribe(topic, (message) => {
      try {
        const parsedMessage = JSON.parse(message.body)
        console.log(`New message received for topic ${topic}:`, parsedMessage)
        messageHandlerRef.current(parsedMessage)
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    })

    subscriptionsRef.current.set(topic, subscription)
    console.log(`Subscribed to topic: ${topic}`)
  }

  // Helper function to unsubscribe from a topic
  const unsubscribeFromTopic = (topic) => {
    const subscription = subscriptionsRef.current.get(topic)
    if (subscription) {
      subscription.unsubscribe()
      subscriptionsRef.current.delete(topic)
      console.log(`Unsubscribed from topic: ${topic}`)
    }
  }

  // Function to subscribe to multiple topics (for future use)
  const subscribeToTopics = (topics) => {
    if (!clientRef.current || !isConnected) return

    topics.forEach((topic) => {
      if (!subscriptionsRef.current.has(topic)) {
        subscribeToTopic(clientRef.current, topic)
      }
    })
  }

  // Function to unsubscribe from multiple topics (for future use)
  const unsubscribeFromTopics = (topics) => {
    topics.forEach((topic) => {
      unsubscribeFromTopic(topic)
    })
  }

  return {
    isConnected,
    client: clientRef.current,
    subscribeToTopics,
    unsubscribeFromTopics,
  }
}
