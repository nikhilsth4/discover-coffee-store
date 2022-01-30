import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"

import styles from "../../styles/coffee-store.module.css"
import cls from "classnames"
import { fetchCoffeeStores } from "../../lib/coffee-stores"
import { StoreContext } from "../../store/store-context"
import { isEmpty } from "../../utils"

export async function getStaticProps(staticProps) {
  const params = staticProps.params

  const coffeeStores = await fetchCoffeeStores()
  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore?.id?.toString() === params.id //dynamic id
  })
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  }
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores()

  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: { id: coffeeStore?.id?.toString() },
    }
  })
  return {
    paths,
    fallback: true,
  }
}

const CoffeeStore = (initialProps) => {
  const router = useRouter()
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore || {})

  console.log(coffeeStore)
  const { id } = router.query

  const { dispatch, state } = useContext(StoreContext)
  const { coffeeStores } = state
  console.log(coffeeStores)

  useEffect(() => {
    if (isEmpty(initialProps?.coffeeStore || {})) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id //dynamic id
        })
        console.log({ coffeeStoreFromContext })
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext)
          // handleCreateCoffeeStore(coffeeStoreFromContext)
        }
      }
    } else {
      // SSG
      // handleCreateCoffeeStore(coffeeStore)
    }
  }, [coffeeStores, id, initialProps.coffeeStore])

  if (router.isFallback) {
    return <div>Loading</div>
  }
  const handleUpvoteButton = () => {
    console.log("h")
  }

  const { address, name, imgUrl, neighbourhood } = coffeeStore
  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              width={24}
              height={24}
              alt="places icon"
            />
            <p className={styles.text}>{address}</p>
          </div>
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width={24}
                height={24}
                alt="icon"
              />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width={24}
              height={24}
              alt="icon"
            />
            <p className={styles.text}>1</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Upvote
          </button>
        </div>
      </div>
    </div>
  )
}

export default CoffeeStore