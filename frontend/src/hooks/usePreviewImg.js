import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

const usePreviewImg = () => {

    const [imgUrl, setImgUrl] = useState(null)
    const showToast = useShowToast()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        // console.log(file);
        if(file && file.type.startsWith("image/")) {
          const reader = new FileReader();

          reader.onloadend = () => {
            setImgUrl(reader.result);
          }

          reader.readAsDataURL(file);
        }else{
          showToast("Invalid file type", "Please select an image file", "error")
          setImgUrl(null);
        }

    }

  return {handleImageChange, imgUrl, setImgUrl}
}

export default usePreviewImg


/*

  const fileRef = useRef(null)
  const { handleImageChange, imgUrl } = usePreviewImg()

  <Center>
    <Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic} />
  </Center>
  <Center w="full">
    <Button w="full" onClick={() => fileRef.current.click()} >Change Avatar</Button>
    <Input type='file' hidden ref={fileRef} onChange={handleImageChange}/>
  </Center>

*/