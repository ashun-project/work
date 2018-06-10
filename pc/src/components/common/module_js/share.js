/***
 * @author lee
 * @param {dom元素}
 * 
 * 将分享放置在指定位置
 * 
 * ***/
function shareInDom (ele) {
    let dom = document.getElementsByClassName('lee-share')[0]
    if (dom && ele) {
        ele.appendChild(dom)
    }
}
export default shareInDom
