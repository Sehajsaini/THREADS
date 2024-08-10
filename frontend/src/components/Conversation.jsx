import {
	Avatar,
	AvatarBadge,
	Box,
	Flex,
	Image,
	Stack,
	Text,
	WrapItem,
	useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messagesAtom";

const Conversation = ({ conversation, isOnline }) => {
	const user = conversation.participants[0];
	const currentUser = useRecoilValue(userAtom);
	const lastMessage = conversation.lastMessage;
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);

	const bgColor = useColorModeValue("gray.100", "black"); // Light background for light mode, black for dark mode
	const hoverBgColor = useColorModeValue("gray.200", "gray.800"); // Slightly lighter on hover for dark mode
	const selectedBgColor = useColorModeValue("gray.300", "gray.600"); // Background color for selected conversation
	const textColor = useColorModeValue("black", "white"); // Text color for readability

	return (
		<Flex
			gap={4}
			alignItems={"center"}
			p={"2"}
			bg={selectedConversation?._id === conversation._id ? selectedBgColor : bgColor}
			color={textColor}
			_hover={{
				cursor: "pointer",
				bg: useColorModeValue("gray.200", "gray.800"), // Hover color for both light and dark modes
			}}
			onClick={() =>
				setSelectedConversation({
					_id: conversation._id,
					userId: user._id,
					userProfilePic: user.profilePic,
					username: user.username,
					mock: conversation.mock,
				})
			}
			borderRadius={"md"}
		>
			<WrapItem>
				<Avatar
					size={{
						base: "xs",
						sm: "sm",
						md: "md",
					}}
					src={user.profilePic}
				>
					{isOnline && <AvatarBadge boxSize='1em' bg='green.500' />}
				</Avatar>
			</WrapItem>

			<Stack direction={"column"} fontSize={"sm"}>
				<Text fontWeight='700' display={"flex"} alignItems={"center"} color={textColor}>
					{user.username} <Image src='/verified.png' w={4} h={4} ml={1} />
				</Text>
				<Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1} color={textColor}>
					{currentUser._id === lastMessage.sender ? (
						<Box color={lastMessage.seen ? "blue.400" : textColor}>
							<BsCheck2All size={16} />
						</Box>
					) : null}
					{lastMessage.text.length > 18
						? lastMessage.text.substring(0, 18) + "..."
						: lastMessage.text || <BsFillImageFill size={16} />}
				</Text>
			</Stack>
		</Flex>
	);
};

export default Conversation;
