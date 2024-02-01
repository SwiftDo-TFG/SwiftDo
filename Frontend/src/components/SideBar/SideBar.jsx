import * as React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './SideBar.styles'; 
import AddButton from '../common/addButton';

const Separator = () => {
    return (
        <View style={styles.separator} />
    )
}

const today = new Date();
const formattedDate = `${today.getDate()} de ${getMonthName(today.getMonth())} del ${today.getFullYear()}`;

function getMonthName(month) {
    const monthNames = ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'];
    return monthNames[month];
}

export default ({ navigation }) => {
    return (
        <View style={{flex:1}}>
            <DrawerContentScrollView style={{ padding: 20, }}>
                <View style={styles.profileContainer}>
                    <View style={styles.profileInfoContainer}>
                        <Image
                            style={styles.profile}
                            source={require('../../assets/perfil.png')}
                        />
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileUser}>Usuario</Text>
                            <Text style={styles.profileDate}>{formattedDate}</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <View style={styles.todasAreasContainer}>
                            <Text style={styles.areasTitle}>Todas las áreas</Text>
                            <FontAwesome name="chevron-right" size={20} color="#4f6072" />
                        </View>
                    </TouchableOpacity>
                </View>
                <Separator />
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('Inbox')}>
                        <View style={styles.actionContainer}>
                            <View style={styles.action}>
                                <FontAwesome5 name="inbox" style={styles.iconAction} color={'#f39f18'} />
                                <Text style={styles.actionTitle}>Inbox</Text>
                            </View>
                            <View style={styles.countContainer}>
                                <View style={[styles.count, { backgroundColor: '#e3e4e5' }]}>
                                    <Text>3</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.actionContainer}>
                            <View style={styles.action}>
                                <FontAwesome5 name="play" style={styles.iconAction} color={'#4f6072'} />
                                <Text style={styles.actionTitle}>Hoy</Text>
                            </View>
                            <View style={styles.countContainer}>
                                <View style={[styles.count, { backgroundColor: '#e14736' }]}>
                                    <Text>1</Text>
                                </View>
                                <View style={[styles.count, { backgroundColor: '#e3e4e5' }]}>
                                    <Text>4</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('CuantoAntes')}>
                        <View style={styles.actionContainer}>
                            <View style={styles.action}>
                                <FontAwesome5 name="bolt" style={styles.iconAction} color={'#ffd700'} />
                                <Text style={styles.actionTitle}>Cuanto antes</Text>
                            </View>
                            <View style={styles.countContainer}>
                                <View style={[styles.count, { backgroundColor: '#e3e4e5' }]}>
                                    <Text>1</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Programadas')}>
                        <View style={styles.actionContainer}>
                            <View style={styles.action}>
                                <Ionicons name="calendar-outline" style={styles.iconAction} color={'#008080'} />
                                <Text style={styles.actionTitle}>Programadas</Text>
                            </View>
                            <View style={styles.countContainer}>
                                <View style={[styles.count, { backgroundColor: '#e3e4e5' }]}>
                                    <Text>1</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Archivadas')}>
                        <View style={styles.actionContainer}>
                            <View style={styles.action}>
                                <FontAwesome5 name="archive" style={styles.iconAction} color={'#d2b48c'} />
                                <Text style={styles.actionTitle}>Algún día</Text>
                            </View>
                            <View style={styles.countContainer}>
                                <View style={[styles.count, { backgroundColor: '#e3e4e5' }]}>
                                    <Text>1</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Project')}>
                        <View style={styles.actionContainer}>
                            <View style={styles.action}>
                                <MaterialCommunityIcons name="hexagon-slice-6" style={styles.iconAction} size={26} color="red" />
                                <Text style={styles.actionTitle}>Proyecto</Text>
                            </View>
                            <View style={styles.countContainer}>
                                <View style={[styles.count, { backgroundColor: '#e3e4e5' }]}>
                                    <Text>1</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <Separator />

            </DrawerContentScrollView>
            <AddButton/>
        </View>
        
    )
}