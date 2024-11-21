// const profileView = () => { // 분리해서 summary View 로
//     const renderTotalPostText = (amount: number, due: number) => {
//         if (amount < 1) {
//             return (
//                 // 작성한 글이 없을때
//                 <View style={{ gap: 5 }}>
//                     <CustomText>
//                         아직 작성한 감사가 <CustomText style={{ fontWeight: 600, fontSize: 16 }}>없어요</CustomText>
//                         🥲
//                     </CustomText>
//                     <CustomText>오늘 한번 작성해보시는 건 어떨까요?</CustomText>
//                 </View>
//             );
//         } else {
//             return (
//                 // 작성한 글이 있을때
//                 <View style={{ gap: 5 }}>
//                     <CustomText>
//                         <CustomText style={{ fontWeight: 600, fontSize: 16 }}>{due}</CustomText>일 동안 총{' '}
//                         <CustomText style={{ fontWeight: 600, fontSize: 16 }}>{amount}</CustomText>개의 감사를
//                         작성하셨어요!
//                     </CustomText>
//                 </View>
//             );
//         }
//     };
//     // amount, userdata
//     return (
//         <View
//             style={{
//                 // alignItems: 'center',
//                 marginBottom: 15,
//             }}
//         >
//             <View
//                 style={{
//                     width: 100,
//                     aspectRatio: 1,
//                     borderRadius: 15,
//                     overflow: 'hidden',
//                     alignSelf: 'center',
//                     marginBottom: 20,
//                     marginTop: 10,
//                 }}
//             >
//                 {/* 프로필 이미지 임시 */}
//                 <View style={{ backgroundColor: '#DDD', width: '100%', height: '100%' }} />
//             </View>
//             <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 5, columnGap: 3 }}>
//                 <CustomText style={{ fontSize: 25, fontWeight: 600 }}>KROCK</CustomText>
//                 <CustomText style={{ fontSize: 14 }}>님</CustomText>
//             </View>
//             {renderTotalPostText(2, 10)}
//             {/* {renderTotalPostText(0, 10)} */}
//         </View>
//     );
// };
