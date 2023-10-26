import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import HeaderComponent from './wrap/HeaderComponent';
import MainComponent from './wrap/MainComponent';
import FooterComponent from './wrap/FooterComponent';
import TopModalComponent from './wrap/TopModalComponent';
import QuickMenuComponent from './wrap/QuickMenuComponent';
import GoTopComponent from './wrap/GoTopComponent';
// 서브 컴포넌트
import Sub1Component from './wrap/sub/Sub1Component';
import Sub2Component from './wrap/sub/Sub2Component';
import Sub3Component from './wrap/sub/Sub3Component';
import Sub4Component from './wrap/sub/Sub4Component';
import Sub5SignUpComponent from './wrap/sub/Sub5SignUpComponent';
import Sub6SignInComponent from './wrap/sub/Sub6SignInComponent';
import Sub7NoticeComponent from './wrap/sub/Sub7NoticeComponent';
import ConfirmModal from './wrap/ConfirmModal';

// 주소검색 API 컴포넌트
import AddressSearchComponent from './wrap/AddressSearchComponent';


import './wrap/scss/wrap.scss';

 // 최상위 컴포넌트
export default function WrapComponent() {

    // 컨펌모달
    const [state, setState] = React.useState({
        msg:'임시 컨펌모달 메시지 입니다.',
        isConfirmModal: false,
        isAddressSearch: false
    }); 
    
    // 주소
    const [address, setAddress] = React.useState({        
        주소1:'',
        주소2:'',
    }); 

    // 최근 본상품     
    const [product, setProduct] = React.useState({});  //1. 객체 Object
    
    // 검증
    const [flag, setFlag] = React.useState(false);

    const [viewProduct, setViewProduct] = React.useState([]);  // [{...},{...},{...}] 


    // 1. 지금 본 상품 클릭한 데이터 가져오기
    const currentViewProduct=(item, imgPath)=>{     
        
        const obj = {  //키(Key): 값(Value)
            번호: item.번호,
            상품명: item.상품명,
            이미지: `${imgPath}${imgPath.indexOf('section4')!==-1?'sec4_img.jpg':item.이미지}`,
            정가: item.정가,
            할인율: `${Math.round(item.할인율 * 100)}%`,
            판매가: Math.round(item.정가 * (1-item.할인율)),
            후기: item.후기
        }
        setProduct(obj);
    }


    //2. 로컬스토레이지에 저장하기 
    //   언제? => 상태변수 객체(product)에 저장완료되면
    //   저장소에 저장된 데이터가 있는 경우
    //       => 저장소에 저장된 데이터를 가져온다.
    //       => 그리고 스택구조형식으로 현재 데이터를 위에 넣고 저장한다.(스택구조)
    //       Stack(스택) : 후입선출법 Last In First Out  => lIFO 리포
    //       Que(큐)     : 선입선출법 First In First Out  => FIFO 피포

    //   저장소에 저장된 데이터가 없는 경우 => 현재 클릭한 데이터만 저장한다.
    React.useEffect(()=>{
        // 1. 임시 배열 생성한다.
         let imsi = [];              
        // 2. {} 객체 데이터가 있다면
        if(Object.keys(product).length > 0){
            imsi = [product];
        }  
        // 3. 저장소 데이터가 없다면 => 임시배열에 객체를 넣어서 저장소 저장한다.
        if(localStorage.getItem('KURLY_VIEW_PRODUCT')===null){
            if(imsi.length>0){
                localStorage.setItem('KURLY_VIEW_PRODUCT', JSON.stringify(imsi)); // [{..}]
            }
        }
                // 4. 저장소 데이터가 있다면 => 데이터 가져온다.
                //    =>  가져온 배열 데이터에 현재 클릭한 겍체{} 를 스택구조로 저장한다.
        else {
            let result = JSON.parse(localStorage.getItem('KURLY_VIEW_PRODUCT')); // 배열데이터가져오기
            //  중복검사
            //  저장소에 저장된 데이터가 현재 보고있는 상품과 중복되면 저장취소
            let filterResult = result.map((item)=>item.번호===product.번호); // 배열에 참 거짓
            //filterResult = [true, false, false]
            //console.log( filterResult );            
            if(filterResult.includes(true)){ // 중복된 데이터가 있으면 true 있다
                return;
            }
            else{ // 중복안됨
                if(Object.keys(product).length>0){
                    result=[product, ...result];  // [{...},{..}] 스택
                    // 최종 로컬스토레이지에 저장하기
                    localStorage.setItem('KURLY_VIEW_PRODUCT', JSON.stringify(result));
                }
            }
        }
        // 깃발 흔든다
        setFlag( !flag );
    },[product]);

    //3.로컬스토레이지에 데이터가 저장완료! 되면
    //  로컬스토레이지 데이터 가져오기 해서 
    //  최상위 컴포넌트의 상태변수 ViewProduct => 퀵메뉴에 바인딩 
    React.useEffect(()=>{
      
        if(localStorage.getItem('KURLY_VIEW_PRODUCT')===null){
            return;
        }
        const result = JSON.parse(localStorage.getItem('KURLY_VIEW_PRODUCT'));       
        setViewProduct(result);  // 최상위 컴포넌트의 상태변수에 저장

    },[flag]);


    // 퀵메뉴  위, 아래  슬라이드 애니메이션
    // 아래(down) 클릭  cnt++
    // 위(up) 클릭  cnt--
    // 74.656+10 = 84.656px
    // 1. 상태변수 cnt
    // 2. up & down 버튼 클릭 이벤트 cnt++  cnt--
    // 3. 상태변수 cnt 값이 변경되면 
    // 4. 애니메이션 메인슬라이드 함수를 실행
    
    // 1. 상태변수 cnt
    const [cnt, setCnt] = React.useState(0);

    // 2. up & down 버튼 클릭 이벤트 cnt++  cnt--





    // 새로고침, 로딩시
    // 저장소에서 가져오기
    // 그리고 상태관리자에 저장하기
    React.useEffect(()=>{
      
        try{ // 오류발생하면 캐치 문으로 보낸다.
            const result = JSON.parse(sessionStorage.getItem('POSTCODE_ADDRESS'));
            
            setAddress({
                주소1: result.주소1,
                주소2: result.주소2
            });
        }
        catch{  // 오류를 해결하고  리턴
           
        }

    },[address.주소1, address.주소2]); // 새로고침, 로딩시 1회, 


    // 주소 저장 메서드
    const addressSave=(주소1,주소2)=>{
        setAddress({
            주소1: 주소1,
            주소2: 주소2
        });
    }


    // 컨펌모달 메시지, isConfirmModal
    // 제어 가능하게 메서드 만든다.
    // 열기
    const confirmModalOpen=(msg)=>{
        setState({
            ...state,
            msg: msg,
            isConfirmModal: true
        })
    } 
    // 닫기
    const confirmModalClose=()=>{
        setState({
            ...state,
            msg: '',
            isConfirmModal: false
        })
    } 
    

    // npm  i  react-daum-postcode
    // 주소검색 API
    // 열기
    const addressSearchOpen=()=>{
        setState({
            ...state,
            isAddressSearch: true
        })
    }
    // 닫기
    const addressSearchClose=()=>{
        setState({
            ...state,
            isAddressSearch: false
        })
    }






    return (
        <div id='wrap'>
            <TopModalComponent />

                <BrowserRouter basename={process.env.PUBLIC_URL}>
                    <Routes>
                        <Route path='/' element={<HeaderComponent  addressSearchOpen={addressSearchOpen} 주소1={address.주소1}  주소2={address.주소2} />}>
                            <Route index element={<MainComponent  currentViewProduct={currentViewProduct} />}/>
                            <Route path='/index' element={<MainComponent  currentViewProduct={currentViewProduct} />}/>
                            <Route path='/sub1' element={<Sub1Component   currentViewProduct={currentViewProduct} />}/>
                            <Route path='/sub2' element={<Sub2Component   currentViewProduct={currentViewProduct} />}/>
                            <Route path='/sub3' element={<Sub3Component   currentViewProduct={currentViewProduct} />}/>
                            <Route path='/sub4' element={<Sub4Component />} />
                            <Route path='/sub5' element={<Sub5SignUpComponent  confirmModalOpen={confirmModalOpen} addressSearchOpen={addressSearchOpen} 주소1={address.주소1}  주소2={address.주소2} isConfirmModal={state.isConfirmModal}  />}/>
                            <Route path='/sub6' element={<Sub6SignInComponent />}/>
                            <Route path='/sub7' element={<Sub7NoticeComponent />}/>
                        </Route>
                    </Routes>
                </BrowserRouter>

            <FooterComponent />
            <QuickMenuComponent   viewProduct={viewProduct}/>
            <GoTopComponent />
            {
                state.isConfirmModal && <ConfirmModal  msg={state.msg}  confirmModalClose={confirmModalClose} />
            }

            {/* 카카오 주소검색 API */}
            {
                state.isAddressSearch && <AddressSearchComponent  addressSave={addressSave} addressSearchClose={addressSearchClose} />
            }

        </div>
    );
};