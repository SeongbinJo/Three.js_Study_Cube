import { Link } from 'react-router-dom'

function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Link to="/ver1">
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>Ver1_25.02.06</button>
        </Link>
        <Link to="/ver2">
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>Ver2_25.02.12</button>
        </Link>
        <Link to="/ver3">
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>Ver3_25.02.17</button>
        </Link>
        <Link to="/ver4">
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>Ver4_25.02.19</button>
        </Link>
        <Link to="/ver5">
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>Ver5_25.02.26</button>
        </Link>
        <Link to="/ver6">
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>Ver6_25.03.03</button>
        </Link>
        <Link to="/ver7">
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>Ver7_25.03.10</button>
        </Link>
        <Link to="/sidepage">
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>SidePage_투과_25.03.14</button>
        </Link>
        <Link to="/sidepage2">
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>SidePage2_가동범위_25.03.19</button>
        </Link>
        <Link to="/sidepage2_1">
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>SidePage2_1_가동범위_25.03.23</button>
        </Link>
        <Link to="/sidepage3">
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>SidePage3_물리법칙</button>
        </Link>
        {/* <Link to="/sidepage4">
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>SidePage4_축 제한 이동</button>
        </Link> */}
      </div>
    </div>
  )
}

export default Home