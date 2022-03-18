import React, { useState } from "react"
import ReactTypingEffect from 'react-typing-effect'
import logo from './images/logo192.png'
import LazyLoad from 'react-lazyload'
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Spinner = () => (
  <div className="post loading">
    <svg
      width="80"
      height="80"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke="#49d1e0"
        strokeWidth="10"
        r="35"
        strokeDasharray="164.93361431346415 56.97787143782138"
        transform="rotate(275.845 50 50)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          calcMode="linear"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
          dur="1s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
);

const GoTop = (props) => {

  // const [intervalId, setIntervalId] = React.useState(0);
  const [thePosition, setThePosition] = React.useState(false)

  const timeoutRef = React.useRef(null)

  React.useEffect(() => {
    document.addEventListener("scroll", () => {
      if (window.scrollY > 170) {
        setThePosition(true)
      } else {
        setThePosition(false)
      }
    });
    // window.scrollTo(0, 0);
  }, [])

  const onScrollStep = () => {

    if (window.pageYOffset === 0) {
      clearInterval(timeoutRef.current)
    }
    window.scroll(0, window.pageYOffset - props.scrollStepInPx)
  }

  const scrollToTop = () => {
    timeoutRef.current = setInterval(onScrollStep, props.delayInMs)

  }

  const renderGoTopIcon = () => {
    return (
      <button className={`go-top ${thePosition ? 'active' : ''}`} onClick={scrollToTop}>
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
    )
  }

  return (
    <React.Fragment>
      {renderGoTopIcon()}
    </React.Fragment>
  )
}

const App = () => {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])
  const [getInfo, setGetInfo] = useState({})

  const handleSearch = async e => {
    e.preventDefault()
    if (search.trim() === ' ' || search.trim() === "" || search.trim().length < 1) return alert("Có thể bạn chưa nhập dữ liệu hoặc dữ liệu bạn tìm không tồn tại 😌")
    const url = `https://vi.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=max&srsearch=${search.trim()}`
    const res = await fetch(url)
    if (!res.ok)
      throw Error(res.statusText)
    const json = await res.json()
    setResults(json.query.search)
    setGetInfo(json.query.searchinfo)
    if (getInfo.totalhits < 1) return alert("Có thể bạn chưa nhập dữ liệu hoặc dữ liệu bạn tìm không tồn tại 😌")
  }

  return (
    <div className="App">
      <header>
        <img src={logo} alt="error images" />
        <ReactTypingEffect
          text={["WIKI TOOLS"]}
          cursorRenderer={cursor => <h1>{cursor}</h1>}
          displayTextRenderer={(text, i) => {
            return (
              <>
                <h1>
                  {text.split('').map((char, i) => {
                    const key = `${i}`;
                    return (
                      <span
                        key={key}
                      >{char}</span>
                    );
                  })}
                </h1>
              </>
            );
          }}
        />
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="[ Hãy tìm kiếm thứ gì đó! ]"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </form>
        {getInfo.totalhits ? <p>Kết quả tìm được: {getInfo.totalhits}</p> : null}
      </header>
      <div className="results post-container">
        {results.map((result, i) => {
          const targetUrl = `https://vi.wikipedia.org/?curid=${result.pageid}`;
          return (
            <LazyLoad
              height={100}
              once={true}
              offset={[-100, 100]}
              placeholder={<Spinner />}
            >
              <div className="result">
                <h3>[ {result.title} ]</h3>
                <p dangerouslySetInnerHTML={{ __html: result.snippet }}></p>
                <a href={targetUrl} target="_blank" rel="noreferrer">Đọc thêm</a>
              </div>
            </LazyLoad>
          )
        })}
      </div>
      {getInfo.totalhits < 1 || search.trim() === ' ' || search.trim() === " " ? <button>Không tìm thấy</button> : null}
      {getInfo.totalhits > 1 ? <GoTop scrollStepInPx="100" delayInMs="10.50" /> : null}
    </div >
  );
}

export default App;


