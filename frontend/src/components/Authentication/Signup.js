import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const showPassword = () => setShow(!show);
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dbxyeqvms");
      data.append("api_key", "761993668115663");

      let config = {
        mode: "no-cors",
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api.cloudinary.com/v1_1/dbxyeqvms//upload",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios
        .request(config)
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        });

      // fetch("https://api.cloudinary.com/v1_1/dbxyeqvms", {
      //   mode: "no-cors",
      //   method: "post",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: data,
      // })
      //   .then((res) => res.json())
      //   .then((data) => {
      //     setPic(data.url.toString());
      //     setLoading(false);
      //   });
    } else {
      toast({
        title: "Please select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const submitHandler = () => {};
  return (
    <VStack spacing="5px">
      <FormControl id="first-name">
        <FormLabel>Name:</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email">
        <FormLabel>Email:</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password">
        <FormLabel>Password:</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Name"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={showPassword}>
              {show ? "hide" : " show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmpassword">
        <FormLabel>ConfirmPassword:</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Name"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={showPassword}>
              {show ? "hide" : " show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Profile Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
}

export default Signup;
