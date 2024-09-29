import { styled } from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/timeline";

const Wrapper = styled.div`
    display: grid;
    overflow-y: scroll;
`;

export default function Home() {
    return(
        <Wrapper>
            <PostTweetForm onSubmit={() => {}}/>
            <Timeline />
        </Wrapper>
    );
};