//npm i @metamask/logo
import React, { useEffect, useRef } from "react";
import ModelViewer from "@metamask/logo";

function MetamaskLogo() {
  // useRef ile DOM elementi için bir referans oluştur
  const elRef = useRef(null);

  useEffect(() => {
    // ModelViewer'ı başlat
    const viewer = ModelViewer({
      pxNotRatio: true,
      width: 200,
      height: 200,
      followMouse: true,
    });

    // elRef.current, div'e karşılık gelir
    if (elRef.current) {
      elRef.current.appendChild(viewer.container);
    }

    // componentWillUnmount'a karşılık gelen temizlik işlemi
    return () => {
      viewer.stopAnimation();
    };
  }, []); // Boş dizi, bu etkinin bileşen mount edildiğinde bir kez çalıştırılacağını belirtir

  return (
    <div
      ref={elRef} // Ref'i div'e atama
    />
  );
}

export default MetamaskLogo;
